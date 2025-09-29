import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../components';
import type { QuizQuestionsPayload } from '../types';
import axios from 'axios';

const useUpdateQuizQuestionsMutation = (quizId: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationKey: ['UPDATE_QUIZ_QUESTIONS'],
    mutationFn: (payload: QuizQuestionsPayload) =>
      axios.patch(`/questions/${payload.id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['QUIZ', quizId] });
      queryClient.invalidateQueries({ queryKey: ['QUIZ_LIST'] });
      toast({
        title: 'Updated!',
        message: 'Question updated successfully',
        intent: 'success',
        filled: true,
      });
    },
  });
};

export default useUpdateQuizQuestionsMutation;
