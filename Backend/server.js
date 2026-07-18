const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cloudinary = require("./cloudinary");
require("dotenv").config();
const { Pool } = require("pg");
const streamifier = require("streamifier");
const PDFDocument = require("pdfkit");
const app = express();

const isCloudDb =
  process.env.DATABASE_URL?.includes("render.com") ||
  process.env.DATABASE_URL?.includes("railway.app") ||
  process.env.DATABASE_URL?.includes("sslmode=") ||
  process.env.DATABASE_URL?.includes("ssl=true");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(isCloudDb ? { ssl: { rejectUnauthorized: false } } : {}),
});

const allowedOrigins = [
  "http://localhost:3000",
  "https://influencerplatformfend.up.railway.app"
];

app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://influencerplatformfend.up.railway.app"
    ];

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, true); // TEMP FIX (important for debugging)
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Simple in-memory SSE clients map
const sseClients = new Map(); // clientId -> send function
let nextClientId = 1;

function addSseClient(sendFn) {
  const id = nextClientId++;
  sseClients.set(id, sendFn);
  return id;
}

function removeSseClient(id) {
  sseClients.delete(id);
}

async function broadcastInfluencers() {
  try {
    const profiles = await pool.query(`SELECT * FROM influencer_profiles ORDER BY id DESC`);
    const payload = JSON.stringify({ type: 'update', influencers: profiles.rows });
    for (const send of sseClients.values()) {
      try {
        send(payload);
      } catch (e) {
        // ignore individual client errors
      }
    }
  } catch (e) {
    console.log('Error broadcasting influencers', e);
  }
}

pool.query("SELECT 1")
  .then(() => {
    console.log("PostgreSQL connected successfully");
    initDb();
  })
  .catch((err) => {
    console.log("Database connection error", err);
  });

async function initDb() {
  try {
    await pool.query(`
      ALTER TABLE influencer_profiles ADD COLUMN IF NOT EXISTS user_id UUID;
      ALTER TABLE influencer_profiles ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);
      ALTER TABLE influencer_profiles ADD COLUMN IF NOT EXISTS name VARCHAR(255);

      ALTER TABLE requests ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';
      ALTER TABLE requests ADD COLUMN IF NOT EXISTS quotation_amount NUMERIC;
      ALTER TABLE requests ADD COLUMN IF NOT EXISTS deal_status VARCHAR(50);
      ALTER TABLE requests ADD COLUMN IF NOT EXISTS invoice_generated BOOLEAN DEFAULT FALSE;
      ALTER TABLE requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS request_id UUID;
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS influencer_email VARCHAR(255);
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS brand_email VARCHAR(255);
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS client_name VARCHAR(255);
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS campaign_name VARCHAR(255);
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pdf_url TEXT;
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
    `);
    console.log("Database schema initialized and verified");
  } catch (e) {
    console.log("Db init error (continuing):", e.message);
  }
}



/* =========================
   HOME API
========================= */

app.get("/", (req, res) => {

  res.send(
    "Backend server is running successfully"
  );

});



/* =========================
   TEST API
========================= */

app.get("/api/test", (req, res) => {

  res.json({
    message: "API working successfully",
  });

});



/* =========================
   SIGNUP API
========================= */

app.post("/api/signup", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role
      `,
      [
        name,
        email,
        hashedPassword,
        role,
      ]
    );

    res.json({
      success: true,
      message: "Signup successful",
      user: newUser.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });

  }

});


/* =========================
   LOGIN API
========================= */

app.post("/api/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }

    const user = result.rows[0];

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });

  }

});

/* =========================
   FORGOT PASSWORD API
========================= */

app.put("/api/forgot-password", async (req, res) => {

  try {

    const { email, newPassword } = req.body;

    const userCheck = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (userCheck.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Email not found",
      });

    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE users
      SET password = $1
      WHERE email = $2
      `,
      [hashedPassword, email]
    );

    res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });

  }

});


/* =========================
   CREATE PROFILE API
========================= */

app.post(
  "/api/create-profile",
  async (req, res) => {

    try {

      const {
        user_email,
        name,
        category,
        city,
        followers_count,
        bio,
        instagram,
        image,
      } = req.body;

      await pool.query(
        `
        INSERT INTO influencer_profiles
        (
          user_email,
          name,
          category,
          city,
          followers_count,
          bio,
          instagram,
          image
        )
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          user_email,
          name,
          category,
          city,
          followers_count,
          bio,
          instagram,
          image,
        ]
      );

      res.json({
        success: true,
        message:
          "Profile created successfully",
      });

      // broadcast updated list to SSE clients
      broadcastInfluencers();

      // notify Postgres listeners
      try {
        await pool.query("NOTIFY influencers_channel, 'profile_created'");
      } catch (e) {
        console.log('Error sending NOTIFY after create:', e);
      }

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });

    }

  }
);

app.post("/api/upload-image", async (req, res) => {
  try {
    const { image } = req.body;

    const result = await cloudinary.uploader.upload(image, {
      folder: "profiles",
    });

    res.json({
      success: true,
      imageUrl: result.secure_url,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   GET ALL INFLUENCERS
========================= */

app.get("/api/influencers", async (req, res) => {
  try {
    let profiles;
    try {
      profiles = await pool.query(`
        SELECT
          influencer_profiles.*,
          COALESCE(users.id::text, influencer_profiles.user_id::text, influencer_profiles.id::text) AS user_id,
          COALESCE(influencer_profiles.name, users.name) AS name,
          COALESCE(influencer_profiles.user_email, users.email) AS user_email
        FROM influencer_profiles
        LEFT JOIN users
          ON users.email::text = influencer_profiles.user_email::text
          OR users.id::text = influencer_profiles.user_id::text
        ORDER BY influencer_profiles.id DESC
      `);
    } catch (e) {
      console.log("JOIN fetch error, using fallback query:", e.message);
      profiles = await pool.query(`SELECT *, id::text AS user_id FROM influencer_profiles ORDER BY id DESC`);
    }

    res.json({
      success: true,
      influencers: Array.isArray(profiles.rows) ? profiles.rows : [],
    });

  } catch (error) {
    console.log("Error fetching influencers:", error);

    res.status(500).json({
      success: false,
      influencers: [],
      error: error.message,
    });
  }
});

/* =========================
   INFLUENCERS SSE STREAM
========================= */

app.get('/api/influencers/stream', async (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  const send = (data) => {
    // data is stringified JSON
    res.write(`data: ${data}\n\n`);
  };

  // add client
  const clientId = addSseClient(send);

  // send initial payload
  try {
    const profiles = await pool.query(`SELECT * FROM influencer_profiles ORDER BY id DESC`);
    send(JSON.stringify({ type: 'initial', influencers: profiles.rows }));
  } catch (e) {
    send(JSON.stringify({ type: 'error', message: 'Could not fetch influencers' }));
  }

  req.on('close', () => {
    removeSseClient(clientId);
  });
});



/* =========================
   GET SINGLE INFLUENCER
========================= */

app.get(
  "/api/influencers/:id",
  async (req, res) => {

    try {

      const { id } = req.params;

      const result =
        await pool.query(
          `
          SELECT *
          FROM influencer_profiles
          WHERE id = $1
          `,
          [id]
        );

      if (result.rows.length === 0) {

        return res.status(404).json({
          success: false,
          message:
            "Influencer not found",
        });

      }

      res.json({
        success: true,
        influencer: result.rows[0],
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });

    }

  }
);

app.get("/api/seo/influencer/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔥 SEO Influencer fetch by user id:", id);

    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,

        i.id AS profile_id,
        i.category,
        i.city,
        i.bio,
        i.instagram,
        i.image,
        i.followers_count

      FROM users u
      LEFT JOIN influencer_profiles i
        ON i.user_id = u.id
      WHERE u.id = $1 AND u.role = 'influencer'
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Influencer not found",
      });
    }

    return res.json({
      success: true,
      influencer: result.rows[0],
    });

  } catch (error) {
    console.log("❌ SEO API error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
/* =========================
   INFLUENCERS BY CITY + CATEGORY
========================= */

app.get(
  "/api/influencers/city/:city/category/:category",
  async (req, res) => {

    try {

      const { city, category } = req.params;

      const result = await pool.query(
        `
        SELECT *
        FROM influencer_profiles
        WHERE LOWER(city) = LOWER($1)
        AND LOWER(category) = LOWER($2)
        `,
        [city, category]
      );

      res.json({
        success: true,
        influencers: result.rows,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        influencers: [],
      });

    }

  }
);
/* =========================
   GET INFLUENCERS BY CITY
========================= */

app.get(
  "/api/influencers/city/:city",
  async (req, res) => {

    try {

      const { city } = req.params;

      const result = await pool.query(
        `
        SELECT *
        FROM influencer_profiles
        WHERE LOWER(city) = LOWER($1)
        ORDER BY followers_count DESC
        `,
        [city]
      );

      res.json({
        success: true,
        influencers: result.rows,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        influencers: [],
      });

    }

  }
);


/* =========================
   GET PROFILE BY EMAIL
========================= */

app.get(
  "/api/profile/:email",
  async (req, res) => {

    try {

      const { email } = req.params;

      const result =
        await pool.query(
          `
          SELECT *
          FROM influencer_profiles
          WHERE user_email = $1
          `,
          [email]
        );

      if (result.rows.length === 0) {

        return res.json({
          success: false,
          message: "Profile not found",
        });

      }

      res.json({
        success: true,
        profile: result.rows[0],
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });

    }

  }
);



/* =========================
   UPDATE PROFILE API
========================= */

app.put(
  "/api/update-profile/:email",
  async (req, res) => {

    try {

      const { email } = req.params;

      const {
        name,
        category,
        city,
        followers_count,
        bio,
        instagram,
        image,
      } = req.body;
console.log("REQ BODY:", req.body);
console.log("followers_count:", followers_count);
      await pool.query(
        `
        UPDATE influencer_profiles
        SET
          name = $1,
          category = $2,
          city = $3,
          followers_count = $4,
          bio = $5,
          instagram = $6,
          image = $7
        WHERE user_email = $8
        `,
        [
          name,
          category,
          city,
          followers_count,
          bio,
          instagram,
          image,
          email,
        ]
      );

      res.json({
        success: true,
        message:
          "Profile updated successfully",
      });

      // broadcast updated list to SSE clients
      broadcastInfluencers();

      // notify Postgres listeners
      try {
        await pool.query("NOTIFY influencers_channel, 'profile_updated'");
      } catch (e) {
        console.log('Error sending NOTIFY after update:', e);
      }

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });

    }

  }
);

app.post(
  "/api/invitations",
  async (req, res) => {
    try {
      console.log("Invitation Request:", req.body);

      const { brand_id, influencer_id, campaign_id } = req.body;

      if (!brand_id || !influencer_id || !campaign_id) {
        return res.status(400).json({
          success: false,
          message: "brand_id, influencer_id, and campaign_id are required",
        });
      }

      // Check existing
      const existing = await pool.query(
        `SELECT * FROM requests 
         WHERE brand_id::text = $1 AND influencer_id::text = $2 AND campaign_id::text = $3`,
        [brand_id, influencer_id, campaign_id]
      );

      if (existing.rows.length > 0) {
        return res.json({
          success: true,
          message: "Invitation already sent for this campaign",
        });
      }

      await pool.query(
        `
        INSERT INTO requests
        (brand_id, influencer_id, campaign_id, status)
        VALUES
        ($1, $2, $3, 'Pending')
        `,
        [brand_id, influencer_id, campaign_id]
      );

      res.json({
        success: true,
        message: "Invitation sent successfully",
      });
    } catch (error) {
      console.log("Invitation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send invitation",
      });
    }
  }
);

app.get("/api/invitations/:influencerId", async (req, res) => {
  try {
    const { influencerId } = req.params;

    const result = await pool.query(
      `
      SELECT
        requests.*,
        campaigns.title,
        campaigns.budget,
        campaigns.category,
        campaigns.description,
        b.name AS brand_name,
        b.email AS brand_email
      FROM requests
      LEFT JOIN campaigns
        ON campaigns.id::text = requests.campaign_id::text
      LEFT JOIN users b
        ON b.id::text = requests.brand_id::text
      WHERE requests.influencer_id::text = $1
         OR requests.influencer_id::text IN (SELECT user_id::text FROM influencer_profiles WHERE id::text = $1)
      ORDER BY requests.created_at DESC
      `,
      [influencerId]
    );

    return res.json({
      success: true,
      invitations: result.rows,
    });
  } catch (error) {
    console.log("Error fetching invitations:", error);
    res.status(500).json({ success: false, invitations: [] });
  }
});

app.put(
  "/api/quotation/:requestId",
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const { quotation_amount } = req.body;

      await pool.query(
        `
        UPDATE requests
        SET quotation_amount = $1, status = 'Quoted'
        WHERE id::text = $2
        `,
        [quotation_amount, requestId]
      );

      res.json({
        success: true,
        message: "Quotation sent successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to send quotation",
      });
    }
  }
);

app.get("/api/brand-quotations/:brandId", async (req, res) => {
  try {
    const { brandId } = req.params;

    const result = await pool.query(
      `
      SELECT
        r.*,
        c.title,
        COALESCE(u.name, ip.name) AS influencer_name
      FROM requests r
      LEFT JOIN campaigns c
        ON c.id::text = r.campaign_id::text
      LEFT JOIN users u
        ON u.id::text = r.influencer_id::text
      LEFT JOIN influencer_profiles ip
        ON ip.user_id::text = r.influencer_id::text OR ip.id::text = r.influencer_id::text
      WHERE r.brand_id::text = $1
        AND r.quotation_amount IS NOT NULL
      ORDER BY r.created_at DESC
      `,
      [brandId]
    );

    res.json({
      success: true,
      quotations: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      quotations: [],
      error: error.message,
    });
  }
});

app.put(
  "/api/deal/:requestId",
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const { deal_status } = req.body;

      await pool.query(
        `
        UPDATE requests
        SET deal_status = $1
        WHERE id::text = $2
        `,
        [deal_status, requestId]
      );

      res.json({
        success: true,
        message: `Deal status updated to ${deal_status}`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to update deal status",
      });
    }
  }
);

app.get(
  "/api/collaborations/:brandId",
  async (req, res) => {
    try {
      const { brandId } = req.params;

      const result = await pool.query(
        `
        SELECT
          r.*,
          c.title,
          COALESCE(u.name, i.name) AS influencer_name
        FROM requests r
        LEFT JOIN campaigns c
          ON c.id::text = r.campaign_id::text
        LEFT JOIN users u
          ON u.id::text = r.influencer_id::text
        LEFT JOIN influencer_profiles i
          ON i.user_id::text = r.influencer_id::text OR i.id::text = r.influencer_id::text
        WHERE r.brand_id::text = $1
        AND (r.deal_status = 'Accepted' OR r.status = 'Completed')
        ORDER BY r.created_at DESC
        `,
        [brandId]
      );

      res.json({
        success: true,
        collaborations: result.rows,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        collaborations: [],
      });
    }
  }
);

app.get(
  "/api/my-collaborations/:influencerId",
  async (req, res) => {
    try {
      const { influencerId } = req.params;

      const result = await pool.query(
        `
        SELECT
          r.*,
          c.title,
          b.name AS brand_name,
          b.email AS brand_email
        FROM requests r
        LEFT JOIN campaigns c
          ON c.id::text = r.campaign_id::text
        LEFT JOIN users b
          ON b.id::text = r.brand_id::text
        WHERE (r.influencer_id::text = $1 OR r.influencer_id::text IN (SELECT user_id::text FROM influencer_profiles WHERE id::text = $1))
        AND (r.deal_status = 'Accepted' OR r.status = 'Completed')
        ORDER BY r.created_at DESC
        `,
        [influencerId]
      );

      res.json({
        success: true,
        collaborations: result.rows,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        collaborations: [],
      });
    }
  }
);

app.get(
  "/api/brand-requests/:brandId",
  async (req, res) => {
    try {
      const { brandId } = req.params;

      const result = await pool.query(
        `
        SELECT
          requests.*,
          campaigns.title,
          COALESCE(u.name, influencer_profiles.name) AS influencer_name
        FROM requests
        LEFT JOIN campaigns
          ON campaigns.id::text = requests.campaign_id::text
        LEFT JOIN users u
          ON u.id::text = requests.influencer_id::text
        LEFT JOIN influencer_profiles
          ON influencer_profiles.user_id::text = requests.influencer_id::text OR influencer_profiles.id::text = requests.influencer_id::text
        WHERE requests.brand_id::text = $1
        ORDER BY requests.created_at DESC
        `,
        [brandId]
      );

      res.json({
        success: true,
        requests: result.rows,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
      });

    }
  }
);


/* =========================
   CONTACT MESSAGE API
========================= */

app.post(
  "/api/contact",
  async (req, res) => {

    try {

      const {
        name,
        email,
        subject,
        message,
      } = req.body;

      await pool.query(
        `
        INSERT INTO contact_messages
        (
          name,
          email,
          subject,
          message
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
          name,
          email,
          subject,
          message,
        ]
      );

      res.json({
        success: true,
        message:
          "Message sent successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });

    }

  }
);



app.get(
  "/api/contact",
  async (req, res) => {

    try {

      const result = await pool.query(
        `
        SELECT *
        FROM contact_messages
        ORDER BY id ASC
        `
      );


      res.json({
        success: true,
        messages: result.rows,
      });


    } catch(error){

      console.log(error);

      res.status(500).json({
        success:false,
        message:"Something went wrong"
      });

    }

  }
);


app.post("/api/requests", async (req, res) => {
  try {
    const { brand_id, influencer_id, campaign_id } = req.body;

    const result = await pool.query(
      `INSERT INTO requests (brand_id, influencer_id, campaign_id, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [brand_id, influencer_id, campaign_id]
    );

    res.json({
      success: true,
      request: result.rows[0],
    });

  } catch (error) {
    console.log("Request API error:", error);
   res.status(500).json({
  success: false,
  error: error.message,
  stack: error.stack
});
  }
});

app.get("/api/requests", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM requests ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      requests: result.rows,
    });

  } catch (error) {
    console.log("Fetch requests error:", error);
res.status(500).json({
  success: false,
  error: error.message,
  stack: error.stack
});
  }
});

app.put(
  "/api/requests/:id",
  async (req, res) => {

    try {

      const { id } = req.params;

      const { status } = req.body;

      await pool.query(
        `
        UPDATE requests
        SET status = $1
        WHERE id = $2
        `,
        [status, id]
      );

      res.json({
        success: true,
        message: "Request updated",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
      });

    }

  }
);
app.put(
  "/api/requests/:id/complete",
  async (req, res) => {

    try {

      const { id } = req.params;

      await pool.query(
        `
        UPDATE requests
        SET status = 'Completed'
        WHERE id = $1
        `,
        [id]
      );

      res.json({
        success: true,
        message: "Campaign marked completed",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
      });

    }

  }
);

/* =========================
   CREATE CAMPAIGN
========================= */

app.post(
  "/api/campaigns",
  async (req, res) => {

    try {

      const {
        brand_id,
        title,
        budget,
        category,
        description
      } = req.body;

      const result =
        await pool.query(
          `
          INSERT INTO campaigns
          (
            brand_id,
            title,
            budget,
            category,
            description
          )
          VALUES
          ($1, $2, $3, $4, $5)
          RETURNING *
          `,
          [
            brand_id,
            title,
            budget,
            category,
            description
          ]
        );

      res.json({
        success: true,
        campaign:
          result.rows[0]
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false
      });

    }

  }
);

app.get(
  "/api/campaigns",
  async (req, res) => {

    try {

      const campaigns =
        await pool.query(
          `
        SELECT
  campaigns.*,
  json_agg(requests) AS requests
FROM campaigns
LEFT JOIN requests ON campaigns.id = requests.campaign_id
GROUP BY campaigns.id;
          `
        );

      res.json({
        success: true,
        campaigns:
          campaigns.rows,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
      });

    }

  }
);
app.put("/api/campaigns/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE campaigns
      SET status = 'Completed'
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      campaign: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
  success: false,
  error: error.message,
  stack: error.stack
});
  }
});
// =========================
// TEST ROUTE (VERIFY DEPLOYMENT)
// =========================
app.get("/api/ping-invoice", (req, res) => {
  console.log("🔥 PING INVOICE HIT");
  res.json({ ok: true, message: "invoice backend working" });
});


// =========================
// GENERATE INVOICE (MAIN)
// =========================
app.post("/api/requests/:id/generate-invoice", async (req, res) => {
  try {
    const { id } = req.params;

    // ── 1. Fetch the request ──────────────────────────────────
    const requestResult = await pool.query(
      `SELECT * FROM requests WHERE id::text = $1`,
      [id]
    );
    if (!requestResult.rows.length) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    const request = requestResult.rows[0];

    if (request.invoice_generated) {
      return res.status(400).json({
        success: false,
        message: "Invoice has already been generated for this campaign",
      });
    }

    // ── 2. Fetch related data ─────────────────────────────────
    const [campaignResult, brandResult, influencerUserResult] = await Promise.all([
      pool.query(`SELECT * FROM campaigns WHERE id = $1`, [request.campaign_id]),
      pool.query(`SELECT * FROM users WHERE id::text = $1`, [request.brand_id]),
      pool.query(`SELECT * FROM users WHERE id::text = $1`, [request.influencer_id]),
    ]);

    const campaign = campaignResult.rows[0];
    const brand = brandResult.rows[0];
    const influencerUser = influencerUserResult.rows[0];

    const influencerProfileResult = await pool.query(
      `SELECT * FROM influencer_profiles WHERE user_email = $1`,
      [influencerUser?.email]
    );
    const influencer = influencerProfileResult.rows[0];

    const amount = Number(request.quotation_amount || 0);
    const gst = Math.round(amount * 0.18 * 100) / 100;
    const total = Math.round((amount + gst) * 100) / 100;

    // ── 3. Insert invoice record ──────────────────────────────
    const invoiceResult = await pool.query(
      `INSERT INTO invoices
       (request_id, influencer_id, brand_id, campaign_id,
        influencer_email, brand_email, client_name, campaign_name,
        amount, gst, total, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        request.id,
        request.influencer_id,
        request.brand_id,
        request.campaign_id,
        influencerUser?.email || "",
        brand?.email || "",
        brand?.name || brand?.email || "",
        campaign?.title || "",
        amount,
        gst,
        total,
        "pending",
      ]
    );
    const createdInvoice = invoiceResult.rows[0];

    // ── 4. Generate PDF into buffer ───────────────────────────
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      buildInvoicePDF(doc, {
        invoiceId: createdInvoice.id,
        date: new Date(),
        clientName: brand?.name || brand?.email || "N/A",
        clientEmail: brand?.email || "N/A",
        influencerName: influencer?.name || influencerUser?.email || "N/A",
        influencerEmail: influencerUser?.email || "N/A",
        campaignTitle: campaign?.title || "N/A",
        campaignCategory: campaign?.category || "Influencer Marketing",
        amount,
        gst,
        total,
        status: "Pending",
      });

      doc.end();
    });

    console.log("PDF buffer size:", pdfBuffer.length);

    // ── 5. Upload to Cloudinary ───────────────────────────────
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "invoices",
          public_id: `invoice_${createdInvoice.id}`,
          format: "pdf",
          use_filename: true,
        },
        (error, result) => {
          if (error) {
            console.log("Cloudinary error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload success:", result.secure_url);
            resolve(result);
          }
        }
      );
      streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
    });

    // ── 6. Save PDF URL + mark invoice generated ──────────────
    await pool.query(`UPDATE invoices SET pdf_url = $1 WHERE id = $2`, [
      uploadResult.secure_url,
      createdInvoice.id,
    ]);

    await pool.query(
      `UPDATE requests SET invoice_generated = TRUE WHERE id::text = $1`,
      [String(request.id)]
    );

    // ── 7. Respond ────────────────────────────────────────────
    return res.json({
      success: true,
      invoice: { ...createdInvoice, pdf_url: uploadResult.secure_url },
      pdf_url: uploadResult.secure_url,
    });

  } catch (err) {
    console.log("Generate invoice error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});
// ============================================================
// SHARED INVOICE PDF BUILDER - PREMIUM TEMPLATE
// ============================================================
function buildInvoicePDF(doc, data) {
  const {
    invoiceId, date, clientName, clientEmail,
    influencerName, influencerEmail,
    campaignTitle, campaignCategory,
    amount, gst, total, status,
  } = data;

  const PAGE_WIDTH = doc.page.width;
  const MARGIN = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const dateStr = new Date(date || Date.now()).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
  const invoiceNum = `INV-${String(invoiceId).padStart(5, "0")}`;

  // ── HEADER BANNER ──────────────────────────────────────────
  doc.rect(0, 0, PAGE_WIDTH, 110).fill("#1a1a2e");

  // Brand name / platform logo area
  doc.fillColor("#e94560").fontSize(22).font("Helvetica-Bold")
    .text("InfluencerPlatform", MARGIN, 28, { width: CONTENT_WIDTH * 0.6 });

  doc.fillColor("#aaaacc").fontSize(9).font("Helvetica")
    .text("Creator Economy Solutions", MARGIN, 54, { width: CONTENT_WIDTH * 0.6 });

  // INVOICE label top-right
  doc.fillColor("#ffffff").fontSize(28).font("Helvetica-Bold")
    .text("INVOICE", MARGIN, 28, { align: "right", width: CONTENT_WIDTH });

  doc.fillColor("#aaaacc").fontSize(10).font("Helvetica")
    .text(invoiceNum, MARGIN, 62, { align: "right", width: CONTENT_WIDTH });

  doc.fillColor("#aaaacc").fontSize(9)
    .text(`Date: ${dateStr}`, MARGIN, 78, { align: "right", width: CONTENT_WIDTH });

  // ── STATUS PILL ────────────────────────────────────────────
  const pillColor = (status || "").toLowerCase() === "paid" ? "#16a34a" : "#d97706";
  const pillLabel = (status || "Pending").toUpperCase();
  const pillX = PAGE_WIDTH - MARGIN - 90;
  doc.roundedRect(pillX, 88, 90, 18, 9).fill(pillColor);
  doc.fillColor("#ffffff").fontSize(8).font("Helvetica-Bold")
    .text(pillLabel, pillX, 92, { width: 90, align: "center" });

  // ── SECTION: BILLED TO / FROM ──────────────────────────────
  let y = 135;

  doc.fillColor("#e94560").fontSize(8).font("Helvetica-Bold")
    .text("BILLED TO", MARGIN, y);

  doc.fillColor("#e94560").fontSize(8).font("Helvetica-Bold")
    .text("SERVICE PROVIDER", MARGIN + CONTENT_WIDTH / 2, y);

  y += 14;
  doc.fillColor("#1a1a2e").fontSize(13).font("Helvetica-Bold")
    .text(clientName || "N/A", MARGIN, y, { width: CONTENT_WIDTH / 2 - 10 });

  doc.fillColor("#1a1a2e").fontSize(13).font("Helvetica-Bold")
    .text(influencerName || "N/A", MARGIN + CONTENT_WIDTH / 2, y, { width: CONTENT_WIDTH / 2 });

  y += 20;
  doc.fillColor("#555577").fontSize(10).font("Helvetica")
    .text(clientEmail || "", MARGIN, y, { width: CONTENT_WIDTH / 2 - 10 });

  doc.fillColor("#555577").fontSize(10).font("Helvetica")
    .text(influencerEmail || "", MARGIN + CONTENT_WIDTH / 2, y, { width: CONTENT_WIDTH / 2 });

  y += 30;
  // thin divider
  doc.moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).strokeColor("#e2e8f0").lineWidth(1).stroke();

  // ── SECTION: CAMPAIGN DETAILS ──────────────────────────────
  y += 18;
  doc.fillColor("#e94560").fontSize(8).font("Helvetica-Bold").text("CAMPAIGN DETAILS", MARGIN, y);

  y += 14;
  // Campaign info row box
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 52, 8).fill("#f8f9fc");

  doc.fillColor("#1a1a2e").fontSize(12).font("Helvetica-Bold")
    .text(campaignTitle || "N/A", MARGIN + 14, y + 10, { width: CONTENT_WIDTH - 28 });

  doc.fillColor("#888899").fontSize(9).font("Helvetica")
    .text(`Category: ${campaignCategory || "Influencer Marketing"}  •  Scope: Full Campaign Collaboration`, MARGIN + 14, y + 30, { width: CONTENT_WIDTH - 28 });

  y += 70;

  // ── SECTION: LINE ITEMS TABLE ──────────────────────────────
  doc.fillColor("#e94560").fontSize(8).font("Helvetica-Bold").text("BREAKDOWN", MARGIN, y);
  y += 14;

  // Table header
  doc.rect(MARGIN, y, CONTENT_WIDTH, 28).fill("#1a1a2e");
  doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold")
    .text("DESCRIPTION", MARGIN + 12, y + 9, { width: CONTENT_WIDTH * 0.55 });
  doc.text("QTY", MARGIN + CONTENT_WIDTH * 0.55, y + 9, { width: 40, align: "center" });
  doc.text("AMOUNT", MARGIN + CONTENT_WIDTH * 0.72, y + 9, { width: CONTENT_WIDTH * 0.28 - 12, align: "right" });

  y += 28;

  // Row helper
  const tableRow = (desc, qty, amt, shade) => {
    doc.rect(MARGIN, y, CONTENT_WIDTH, 26).fill(shade);
    doc.fillColor("#1a1a2e").fontSize(10).font("Helvetica")
      .text(desc, MARGIN + 12, y + 7, { width: CONTENT_WIDTH * 0.55 });
    doc.text(qty, MARGIN + CONTENT_WIDTH * 0.55, y + 7, { width: 40, align: "center" });
    doc.font("Helvetica-Bold")
      .text(amt, MARGIN + CONTENT_WIDTH * 0.72, y + 7, { width: CONTENT_WIDTH * 0.28 - 12, align: "right" });
    y += 26;
  };

  tableRow(`Campaign Service — ${campaignTitle || "Influencer Collaboration"}`, "1",
    `Rs. ${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, "#ffffff");
  tableRow("GST @ 18%", "—",
    `Rs. ${Number(gst).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, "#f8f9fc");

  y += 4;
  // Total row
  doc.rect(MARGIN, y, CONTENT_WIDTH, 36).fill("#1a1a2e");
  doc.fillColor("#aaaacc").fontSize(10).font("Helvetica")
    .text("TOTAL AMOUNT DUE", MARGIN + 12, y + 11, { width: CONTENT_WIDTH * 0.6 });
  doc.fillColor("#e94560").fontSize(16).font("Helvetica-Bold")
    .text(
      `Rs. ${Number(total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      MARGIN + CONTENT_WIDTH * 0.55, y + 8,
      { width: CONTENT_WIDTH * 0.45 - 12, align: "right" }
    );

  y += 54;

  // ── SECTION: NOTES / TERMS ─────────────────────────────────
  doc.moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).strokeColor("#e2e8f0").lineWidth(1).stroke();
  y += 14;

  doc.fillColor("#e94560").fontSize(8).font("Helvetica-Bold").text("PAYMENT TERMS & NOTES", MARGIN, y);
  y += 12;
  doc.fillColor("#888899").fontSize(9).font("Helvetica")
    .text(
      "Payment is due within 15 days of invoice date. All amounts are in Indian Rupees (INR). " +
      "GST @ 18% has been applied as per applicable tax regulations. This invoice is system-generated by InfluencerPlatform.",
      MARGIN, y, { width: CONTENT_WIDTH, lineGap: 4 }
    );

  // ── FOOTER BAR ─────────────────────────────────────────────
  const PAGE_HEIGHT = doc.page.height;
  doc.rect(0, PAGE_HEIGHT - 48, PAGE_WIDTH, 48).fill("#1a1a2e");
  doc.fillColor("#555577").fontSize(8).font("Helvetica")
    .text(
      "InfluencerPlatform  •  platform@influencer.com  •  www.influencerplatform.com",
      0, PAGE_HEIGHT - 28, { align: "center", width: PAGE_WIDTH }
    );
}

// ── STREAMING ENDPOINT (for View PDF button) ───────────────
app.get("/api/invoices/:id/pdf", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM invoices WHERE id::text = $1`, [id]);
    if (!result.rows.length) {
      return res.status(404).send("Invoice not found");
    }
    const invoice = result.rows[0];

    if (invoice.pdf_url && invoice.pdf_url.startsWith("http")) {
      return res.redirect(invoice.pdf_url);
    }

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=INV-${String(invoice.id).padStart(5, "0")}.pdf`);
    doc.pipe(res);

    buildInvoicePDF(doc, {
      invoiceId: invoice.id,
      date: invoice.created_at,
      clientName: invoice.client_name,
      clientEmail: invoice.brand_email,
      influencerName: invoice.influencer_email,
      influencerEmail: invoice.influencer_email,
      campaignTitle: invoice.campaign_name,
      campaignCategory: "Influencer Marketing",
      amount: Number(invoice.amount || 0),
      gst: Number(invoice.gst || 0),
      total: Number(invoice.total || 0),
      status: invoice.status,
    });

    doc.end();
  } catch (err) {
    console.log("PDF stream error:", err);
    res.status(500).send("Error generating PDF invoice");
  }
});

app.get("/api/invoices/influencer/:email", async (req, res) => {
  const { email } = req.params;

  const result = await pool.query(
    `SELECT * FROM invoices
     WHERE influencer_email = $1
     ORDER BY created_at DESC`,
    [email]
  );

  res.json({ success: true, invoices: result.rows });
});
app.get("/api/invoices/brand/:email", async (req, res) => {
  const { email } = req.params;

  const result = await pool.query(
    `SELECT * FROM invoices
     WHERE brand_email = $1
     ORDER BY created_at DESC`,
    [email]
  );

  res.json({ success: true, invoices: result.rows });
});
app.get("/api/brand-invoices/:brandId", async (req, res) => {
  try {
    const { brandId } = req.params;

    const result = await pool.query(
      `
      SELECT i.*, c.title as campaign_title
      FROM invoices i
      LEFT JOIN campaigns c ON c.id = i.campaign_id
      WHERE i.brand_id = $1
      ORDER BY i.created_at DESC
      `,
      [brandId]
    );

    res.json({
      success: true,
      invoices: result.rows,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
});
app.get("/api/invoices/brand/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM invoices
      WHERE brand_id = $1
      ORDER BY created_at DESC
      `,
      [id]
    );

    res.json({
      success: true,
      invoices: result.rows,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      invoices: [],
      error: error.message,
    });
  }
});
/* =========================
   CREATE INVOICE
========================= */

// app.post(
//   "/api/invoices",
//   async (req, res) => {

//     try {

//       const {
//         influencer_email,
//         client_name,
//         campaign_name,
//         amount,
//       } = req.body;

//       const gst =
//         Number(amount) * 0.18;

//       const total =
//         Number(amount) + gst;

//       const result =
//         await pool.query(
//           `
//          INSERT INTO invoices
// (
//   influencer_email,
//   client_name,
//   campaign_name,
//   amount,
//   gst,
//   total,
//   status
// )
//           VALUES
//           ($1,$2,$3,$4,$5,$6,$7)
//           RETURNING *
//           `,
//           [
//             influencer_email,
//             client_name,
//             campaign_name,
//             amount,
//             gst,
//             total,
//             status = "Pending",
//           ]
//         );

//       res.json({
//         success: true,
//         invoice: result.rows[0],
//       });

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         success: false,
//         message: "Failed to create invoice",
//       });

//     }

//   }
// );
// app.get("/api/invoices/:email", async (req, res) => {
//   try {
//     const email = req.params.email?.trim().toLowerCase();

//     const result = await pool.query(
//       `
//       SELECT *
//       FROM invoices
//       WHERE LOWER(influencer_email) = $1
//       ORDER BY id DESC
//       `,
//       [email]
//     );

//     res.json({
//       success: true,
//       invoices: result.rows,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       invoices: [],
//     });
//   }
// });
app.put(
  "/api/invoices/:id/pay",
  async (req, res) => {

    try {

      const { id } = req.params;

      await pool.query(
        `
        UPDATE invoices
        SET status = 'Paid'
        WHERE id = $1
        RETURNING *
        `,
        [id]
      );
 if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }
      res.json({
        success: true,
        message: "Invoice marked as paid",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
      });

    }

  }
);
// app.post("/api/invoices/generate/:requestId", async (req, res) => {
//   try {
//     const { requestId } = req.params;

//     const requestResult = await pool.query(
//       `
//       SELECT *
//       FROM requests
//       WHERE id = $1
//       `,
//       [requestId]
//     );

//     const request = requestResult.rows[0];

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Request not found",
//       });
//     }

//     if (!request.quotation_amount) {
//       return res.json({
//         success: false,
//         message: "Quotation not sent yet",
//       });
//     }

//     if (request.deal_status !== "Accepted") {
//       return res.json({
//         success: false,
//         message: "Deal not active",
//       });
//     }

//     if (request.invoice_generated) {
//       return res.json({
//         success: false,
//         message: "Invoice already generated",
//       });
//     }

//     const campaign = await pool.query(
//       `SELECT * FROM campaigns WHERE id = $1`,
//       [request.campaign_id]
//     );

//     const brand = await pool.query(
//       `SELECT * FROM users WHERE id = $1`,
//       [request.brand_id]
//     );

//     const influencer = await pool.query(
//       `SELECT * FROM influencer_profiles WHERE id = $1`,
//       [request.influencer_id]
//     );

//     const amount = Number(request.quotation_amount);
//     const gst = amount * 0.18;
//     const total = amount + gst;

//     const invoice = await pool.query(
//       `
//       INSERT INTO invoices (
//         influencer_email,
//         client_name,
//         campaign_name,
//         amount,
//         gst,
//         total,
//         status
//       )
//       VALUES ($1,$2,$3,$4,$5,$6,$7)
//       RETURNING *
//       `,
//       [
//         influencer.rows[0].user_email,
//         brand.rows[0].name,
//         campaign.rows[0].title,
//         amount,
//         gst,
//         total,
//         "Pending",
//       ]
//     );

//     await pool.query(
//       `
//       UPDATE requests
//       SET invoice_generated = true
//       WHERE id = $1
//       `,
//       [requestId]
//     );

//     return res.json({
//       success: true,
//       invoice: invoice.rows[0],
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//     });
//   }
// });
/* =========================
   GET BRAND CAMPAIGNS
========================= */

app.get(
  "/api/campaigns/:brandId",
  async (req, res) => {

    try {

      const { brandId } =
        req.params;

      const result =
        await pool.query(
          `
          SELECT *
          FROM campaigns
          WHERE brand_id = $1
          ORDER BY id DESC
          `,
          [brandId]
        );

      res.json({
        success: true,
        campaigns:
          result.rows
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false
      });

    }

  }
);

app.get("/api/search-data", async (req, res) => {

  try {

    const cities = await pool.query(`
      SELECT DISTINCT city
      FROM influencer_profiles
      WHERE city IS NOT NULL
    `);

    const categories = await pool.query(`
      SELECT DISTINCT category
      FROM influencer_profiles
      WHERE category IS NOT NULL
    `);

    res.json({
      success: true,
      cities: cities.rows,
      categories: categories.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

});
/* =========================
   ADMIN MANAGE USERS
========================= */

app.get(
  "/api/admin/users",
  async(req,res)=>{

    try{

      const result =
      await pool.query(
        `
        SELECT 
        id,
        name,
        email,
        role,
        status
        FROM users
        ORDER BY id DESC
        `
      );


      res.json({
        success:true,
        users:result.rows
      });


    }catch(error){

      console.log(error);

      res.status(500).json({
        success:false
      });

    }

});

app.put(
  "/api/admin/users/:id",
  async(req,res)=>{

    try{

      const { id } = req.params;

      const { status } = req.body;


      await pool.query(
        `
        UPDATE users
        SET status = $1
        WHERE id = $2
        `,
        [
          status,
          id
        ]
      );


      res.json({
        success:true,
        message:"User status updated"
      });


    }catch(error){

      console.log(error);

      res.status(500).json({
        success:false
      });

    }

});

/* =========================
   ADMIN VERIFY INFLUENCERS
========================= */


app.get(
  "/api/admin/influencers",
  async(req,res)=>{

    try{


      const result =
      await pool.query(
        `
        SELECT *
        FROM influencer_profiles
        ORDER BY id DESC
        `
      );


      res.json({
        success:true,
        influencers:result.rows
      });



    }catch(error){

      console.log(error);

      res.status(500).json({
        success:false
      });

    }

});



app.put(
  "/api/admin/influencers/:id",
  async(req,res)=>{


    try{


      const {id}=req.params;

      const {verification_status}=req.body;



      await pool.query(
        `
        UPDATE influencer_profiles
        SET verification_status=$1
        WHERE id=$2
        `,
        [
          verification_status,
          id
        ]
      );



      res.json({
        success:true,
        message:"Verification updated"
      });



    }catch(error){


      console.log(error);

      res.status(500).json({
        success:false
      });


    }

});

app.put(
"/api/admin/influencers/:id/verify",
async(req,res)=>{

try{

const {id}=req.params;

const {status}=req.body;


await pool.query(
`
UPDATE influencer_profiles
SET verification_status=$1
WHERE id=$2
`,
[
status,
id
]
);


res.json({
success:true,
message:"Verification updated"
});


}catch(error){

console.log(error);

res.status(500).json({
success:false
});

}

});

app.get("/api/admin/categories", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM categories ORDER BY id ASC`
    );

    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.post("/api/admin/categories", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name required",
      });
    }

    const result = await pool.query(
      `INSERT INTO categories(name)
       VALUES($1)
       RETURNING *`,
      [name]
    );

    res.json({
      success: true,
      category: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.delete("/api/admin/categories/:id", async (req,res)=>{

try{

const {id}=req.params;


await pool.query(
`DELETE FROM categories WHERE id=$1`,
[id]
);


res.json({
success:true,
message:"Category deleted"
});


}catch(error){

console.log(error);

res.status(500).json({
success:false
});

}

});

app.get("/api/admin/analytics", async(req,res)=>{

try{


const users =
await pool.query(
"SELECT COUNT(*) FROM users"
);


const influencers =
await pool.query(
"SELECT COUNT(*) FROM influencer_profiles"
);


const categories =
await pool.query(
"SELECT COUNT(*) FROM categories"
);



const verified =
await pool.query(
`
SELECT COUNT(*)
FROM influencer_profiles
WHERE verification_status='Verified'
`
);



const pending =
await pool.query(
`
SELECT COUNT(*)
FROM influencer_profiles
WHERE verification_status='Pending'
`
);



res.json({

success:true,

analytics:{

users:
Number(users.rows[0].count),

influencers:
Number(influencers.rows[0].count),

categories:
Number(categories.rows[0].count),

verified:
Number(verified.rows[0].count),

pending:
Number(pending.rows[0].count)

}

});


}catch(error){

console.log(error);

res.status(500).json({
success:false
});

}


});


app.get(
  "/api/notifications/:userId",
  async (req, res) => {

    try {

      const result = await pool.query(
        `
        SELECT *
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [req.params.userId]
      );

      res.json({
        success: true,
        notifications: result.rows
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications"
      });

    }

  }
);

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Setup a dedicated listener client for Postgres LISTEN/NOTIFY
let listenerClient;

async function setupListener(){

  try {

    listenerClient = await pool.connect();

    await listenerClient.query(
      "LISTEN influencers_channel"
    );

    listenerClient.on(
      "notification",
      () => {

        broadcastInfluencers();

      }
    );

    console.log(
      "LISTEN setup on influencers_channel"
    );


  } catch(error){

    console.log(
      "Listener error",
      error
    );

  }

}


setupListener();