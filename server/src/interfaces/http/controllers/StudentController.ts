import { Response, NextFunction } from 'express';
import {
  CreateStudentProfileUseCase,
  GetStudentProfileUseCase,
  UpdateStudentProfileUseCase,
} from '../../../application/student/index.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export class StudentController {
  private createStudentProfileUseCase: CreateStudentProfileUseCase;
  private getStudentProfileUseCase: GetStudentProfileUseCase;
  private updateStudentProfileUseCase: UpdateStudentProfileUseCase;

  constructor({
    createStudentProfileUseCase,
    getStudentProfileUseCase,
    updateStudentProfileUseCase,
  }: {
    createStudentProfileUseCase: CreateStudentProfileUseCase;
    getStudentProfileUseCase: GetStudentProfileUseCase;
    updateStudentProfileUseCase: UpdateStudentProfileUseCase;
  }) {
    this.createStudentProfileUseCase = createStudentProfileUseCase;
    this.getStudentProfileUseCase = getStudentProfileUseCase;
    this.updateStudentProfileUseCase = updateStudentProfileUseCase;
  }

  createProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id || req.body.userId;
      const { educationLevel, learningGoals } = req.body;

      const profile = await this.createStudentProfileUseCase.execute({
        userId,
        educationLevel,
        learningGoals,
      });

      res.status(201).json({
        success: true,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };

  getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const profile = await this.getStudentProfileUseCase.execute(
        id ? { studentId: id } : { userId: req.user?.id || 'student-demo-id' }
      );

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentId = req.params.id;
      const { learningGoals, educationLevel } = req.body;

      const profile = await this.updateStudentProfileUseCase.execute({
        id: studentId,
        learningGoals,
        educationLevel,
        requesterId: req.user?.id,
        requesterRole: req.user?.role,
      });

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };
}
