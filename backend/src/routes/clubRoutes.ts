// src/routes/clubRoutes.ts
import { Router, RequestHandler } from 'express';
import Club from '../models/club';

const router = Router();

// Create club
const createClub: RequestHandler = async (req, res) => {
  try {
    const club = new Club({
      name: req.body.name,
      email: req.body.email,
      country: req.body.country,
      league: req.body.league,
      clubSize: req.body.clubSize,
      contactInfo: req.body.contactInfo,
      privacySettings: req.body.privacySettings
    });

    await club.save();

    res.status(201).json({
      success: true,
      data: club
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create club'
    });
  }
};

router.post('/', createClub as RequestHandler);

export default router;