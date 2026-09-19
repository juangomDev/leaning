export interface CreateStudentProfileDTO {
  userId: string;
  educationLevel: string;
  learningGoals: string;
}

export interface UpdateStudentProfileDTO {
  id?: string;
  userId?: string;
  educationLevel?: string;
  learningGoals?: string;
}

export interface StudentResponseDTO {
  id: string;
  userId: string;
  educationLevel: string;
  learningGoals: string;
  createdAt: string;
  updatedAt: string;
}
