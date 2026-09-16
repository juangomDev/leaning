import { Response, NextFunction } from 'express';
import { GetTutorsListUseCase } from '../../../application/use-cases/tutors/GetTutorsListUseCase.js';
import { GetTutorByIdUseCase } from '../../../application/use-cases/tutors/GetTutorByIdUseCase.js';
import { RegisterTutorUseCase } from '../../../application/use-cases/tutors/RegisterTutorUseCase.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export class TutorController {
  private getTutorsListUseCase: GetTutorsListUseCase;
  private getTutorByIdUseCase: GetTutorByIdUseCase;
  private registerTutorUseCase: RegisterTutorUseCase;

  constructor({
    getTutorsListUseCase,
    getTutorByIdUseCase,
    registerTutorUseCase,
  }: {
    getTutorsListUseCase: GetTutorsListUseCase;
    getTutorByIdUseCase: GetTutorByIdUseCase;
    registerTutorUseCase: RegisterTutorUseCase;
  }) {
    this.getTutorsListUseCase = getTutorsListUseCase;
    this.getTutorByIdUseCase = getTutorByIdUseCase;
    this.registerTutorUseCase = registerTutorUseCase;
  }

  getTutors = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = {
        query: (req.query.q as string) || (req.query.query as string),
        category: (req.query.categoria as string) || (req.query.category as string),
        modality: (req.query.modalidad as string) || (req.query.modality as string),
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      };

      const tutors = await this.getTutorsListUseCase.execute(filters);
      res.status(200).json({
        success: true,
        count: tutors.length,
        data: tutors,
      });
    } catch (err) {
      next(err);
    }
  };

  getTutorById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const tutor = await this.getTutorByIdUseCase.execute(id);
      res.status(200).json({
        success: true,
        data: tutor,
      });
    } catch (err) {
      next(err);
    }
  };

  applyTutor = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tutor = await this.registerTutorUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: tutor,
      });
    } catch (err) {
      next(err);
    }
  };
}
