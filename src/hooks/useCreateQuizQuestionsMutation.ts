import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../components';
import type { QuizQuestionsPayload } from '../types';
import axios from 'axios';

const useCreateQuizQuestionsMutation = (quizId: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationKey: ['CREATE_QUIZ_QUESTIONS'],
    mutationFn: (payload: QuizQuestionsPayload) =>
      axios.post(`/quizzes/${quizId}/questions`, {
        prompt: payload.prompt,
        type: payload.type,
        correctAnswer: payload.correctAnswer,
        options: payload.options,
        position: payload.position,
        quizId: payload.quizId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['QUIZ', quizId] });
      queryClient.invalidateQueries({ queryKey: ['QUIZ_LIST'] });
      toast({
        title: 'Success!',
        message: 'Question added successfully',
        intent: 'success',
        filled: true,
      });
    },
  });
};

export default useCreateQuizQuestionsMutation;
