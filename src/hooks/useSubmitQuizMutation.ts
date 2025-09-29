import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

export type Result = {
  score: number;
  details: Array<{ questionId: number; correct: any; expected?: any }>;
};

const useSubmitQuizMutation = () => {
  return useMutation({
    mutationKey: ['SUBMIT_QUIZ'],
    mutationFn: (quizId?: number) =>
      axios.post<Result>(`/attempts/${quizId}/submit`),
  });
};

export default useSubmitQuizMutation;
