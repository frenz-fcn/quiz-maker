import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const useAnswerQuestionMutation = () => {
  return useMutation({
    mutationKey: ['ANSWER_QUESTION'],
    mutationFn: (payload: {
      quizId: number | undefined;
      questionId: number | undefined;
      value: string;
    }) =>
      axios.post(`/attempts/${payload.quizId}/answer`, {
        questionId: payload.questionId,
        value: payload.value,
      }),
  });
};

export default useAnswerQuestionMutation;
