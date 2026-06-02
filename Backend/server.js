const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool, Client } = require("pg");

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

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

pool.connect((err) => {

  if (err) {

    console.log(
      "Database connection error",
      err
    );

  } else {

    console.log(
      "PostgreSQL connected successfully"
    );

  }

});



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
        followers,
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
          followers,
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
          followers,
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



/* =========================
   GET ALL INFLUENCERS
========================= */

app.get(
  "/api/influencers",
  async (req, res) => {

    try {

      const profiles =
        await pool.query(
          `
          SELECT *
          FROM influencer_profiles
          ORDER BY id DESC
          `
        );

      res.json({
        success: true,
        influencers: profiles.rows,
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
        followers,
        bio,
        instagram,
        image,
      } = req.body;

      await pool.query(
        `
        UPDATE influencer_profiles
        SET
          name = $1,
          category = $2,
          city = $3,
          followers = $4,
          bio = $5,
          instagram = $6,
          image = $7
        WHERE user_email = $8
        `,
        [
          name,
          category,
          city,
          followers,
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



/* =========================
   GET CONTACT MESSAGES
========================= */

app.get(
  "/api/contact-messages",
  async (req, res) => {

    try {

      const messages =
        await pool.query(
          `
          SELECT *
          FROM contact_messages
          ORDER BY id DESC
          `
        );

      res.json({
        success: true,
        messages: messages.rows,
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
   SERVER START
========================= */

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});

// Setup a dedicated listener client for Postgres LISTEN/NOTIFY
const listenerClient = new Client({ connectionString: process.env.DATABASE_URL });
listenerClient.connect()
  .then(() => {
    listenerClient.query('LISTEN influencers_channel');
    listenerClient.on('notification', async (msg) => {
      // When notification received, broadcast updated influencers to SSE clients
      try {
        broadcastInfluencers();
      } catch (e) {
        console.log('Error handling notification', e);
      }
    });
    console.log('LISTEN setup on influencers_channel');
  })
  .catch((err) => {
    console.log('Error setting up listener client', err);
  });