export interface IAvailabilityChecker {
  isTutorAvailable(tutorId: string, scheduledAt: Date, durationHours: number): Promise<boolean>;
}

export class DefaultAvailabilityChecker implements IAvailabilityChecker {
  async isTutorAvailable(_tutorId: string, _scheduledAt: Date, _durationHours: number): Promise<boolean> {
    return true;
  }
}
