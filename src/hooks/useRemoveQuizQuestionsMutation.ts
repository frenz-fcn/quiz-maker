import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const useRemoveQuizQuestionsMutation = (quizId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['REMOVE_QUIZ_QUESTIONS'],
    mutationFn: (questionId: number) =>
      axios.delete(`/questions/${questionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['QUIZ', quizId] });
    },
  });
};

export default useRemoveQuizQuestionsMutation;
