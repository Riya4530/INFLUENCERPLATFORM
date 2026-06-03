const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

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
      RETURNING *
      `,
      [
        name,
        email,
        password,
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

    const user = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      AND password = $2
      `,
      [email, password]
    );

    if (user.rows.length === 0) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }

    res.json({
      success: true,
      message: "Login successful",
      user: user.rows[0],
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
   CREATE BRAND PROFILE
========================= */

app.post(
  "/api/create-brand-profile",
  async (req, res) => {

    try {

      const {
        user_email,
        company_name,
        industry,
        website,
        location,
        logo,
        description
      } = req.body;

      await pool.query(
        `
        INSERT INTO brand_profiles
        (
          user_email,
          company_name,
          industry,
          website,
          location,
          logo,
          description
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
          user_email,
          company_name,
          industry,
          website,
          location,
          logo,
          description
        ]
      );

      res.json({
        success: true,
        message:
          "Brand profile created successfully"
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Error creating profile"
      });

    }

  }
);

/* =========================
   GET BRAND PROFILE
========================= */

app.get(
  "/api/brand-profile/:email",
  async (req, res) => {

    try {

      const { email } =
        req.params;

      const result =
        await pool.query(
          `
          SELECT *
          FROM brand_profiles
          WHERE user_email = $1
          `,
          [email]
        );

      if (
        result.rows.length === 0
      ) {

        return res.json({
          success: false,
          profile: null
        });

      }

      res.json({
        success: true,
        profile:
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

/* =========================
   UPDATE BRAND PROFILE
========================= */

app.put(
  "/api/update-brand-profile/:email",
  async (req, res) => {

    try {

      const { email } =
        req.params;

      const {
        company_name,
        industry,
        website,
        location,
        logo,
        description
      } = req.body;

      await pool.query(
        `
        UPDATE brand_profiles
        SET
          company_name = $1,
          industry = $2,
          website = $3,
          location = $4,
          logo = $5,
          description = $6
        WHERE user_email = $7
        `,
        [
          company_name,
          industry,
          website,
          location,
          logo,
          description,
          email
        ]
      );

      res.json({
        success: true,
        message:
          "Brand profile updated successfully"
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Error updating profile"
      });

    }

  }
);

/* =========================
   SEND COLLABORATION REQUEST
========================= */

app.post(
  "/api/send-request",
  async (req, res) => {

    try {

      const {
        brand_email,
        influencer_id,
        message
      } = req.body;

      await pool.query(
        `
        INSERT INTO collaboration_requests
        (
          brand_email,
          influencer_id,
          message
        )
        VALUES
        ($1,$2,$3)
        `,
        [
          brand_email,
          influencer_id,
          message
        ]
      );

      res.json({
        success: true,
        message:
          "Request sent successfully"
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false
      });

    }

  }
);

/* =========================
   GET REQUESTS FOR INFLUENCER
========================= */

app.get(
  "/api/requests/:influencerId",
  async (req, res) => {

    try {

      const { influencerId } =
        req.params;

      const result =
        await pool.query(
          `
          SELECT *
          FROM collaboration_requests
          WHERE influencer_id = $1
          ORDER BY created_at DESC
          `,
          [influencerId]
        );

      res.json({
        success: true,
        requests:
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


/* =========================
   GET COLLABORATION REQUESTS
========================= */

app.get(
  "/api/requests/:influencerId",
  async (req, res) => {

    try {

      const { influencerId } =
        req.params;

      const result =
        await pool.query(
          `
          SELECT *
          FROM collaboration_requests
          WHERE influencer_id = $1
          ORDER BY id DESC
          `,
          [influencerId]
        );

      res.json({
        success: true,
        requests: result.rows
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
  "/api/influencer-requests/:email",
  async (req, res) => {

    try {

      const { email } = req.params;

      const result =
        await pool.query(
          `
          SELECT
            collaboration_requests.*,
            brand_profiles.company_name,
            brand_profiles.logo
          FROM collaboration_requests
          LEFT JOIN brand_profiles
          ON collaboration_requests.brand_email =
             brand_profiles.user_email
          WHERE influencer_id IN (
            SELECT id
            FROM influencers
            WHERE user_email = $1
          )
          ORDER BY created_at DESC
          `,
          [email]
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
   SERVER START
========================= */

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});