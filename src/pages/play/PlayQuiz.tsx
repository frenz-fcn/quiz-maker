import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Text, TextInput } from '../../components';
import CodeBlock from '../../components/CodeBlock';
import {
  useAnswerQuestionMutation,
  useSubmitQuizMutation,
  useAntiCheatContext,
} from '../../hooks';
import type { Attempt, QuizQuestion } from '../../types';

type Answer = { questionId: number | undefined; value: string };

const Question = ({
  question,
  onSuccess,
  onBack,
  isLastQuestion,
}: {
  question: Omit<QuizQuestion, 'correctAnswer'>;
  onSuccess: () => void;
  onBack: () => void;
  isLastQuestion: boolean;
}) => {
  const navigate = useNavigate();
  const { getSummary } = useAntiCheatContext();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [qAnswer, setQAnswer] = useState<string>('');
  const { mutate: answerQuestion, isPending: isAnswerQuestionPending } =
    useAnswerQuestionMutation();
  const { mutate: submitQuiz, isPending: isSubmitQuizPending } =
    useSubmitQuizMutation();
  const antiCheat = useAntiCheatContext();

  const isPending = isAnswerQuestionPending || isSubmitQuizPending;

  const onUpdateAnswers = useCallback(
    (newAnswer: Answer) =>
      setAnswers((prev) => {
        const existingIdx = prev.findIndex(
          (a) => a.questionId === newAnswer.questionId
        );
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            value: newAnswer.value,
          };
          return updated;
        }
        return [...prev, newAnswer];
      }),
    []
  );

  const onSubmitAnswer = useCallback(() => {
    onUpdateAnswers({
      questionId: question.id,
      value: qAnswer,
    });
    answerQuestion(
      {
        questionId: question.id,
        quizId: question.quizId,
        value: qAnswer,
      },
      {
        onSuccess: () => {
          setQAnswer('');
          if (isLastQuestion)
            return submitQuiz(question.quizId, {
              onSuccess: (res) => {
                navigate('/play/result', {
                  state: {
                    ...res.data,
                    quizId: question.quizId,
                    antiCheat: getSummary(),
                  },
                });
              },
            });
          onSuccess();
        },
      }
    );
  }, [
    answerQuestion,
    onSuccess,
    onUpdateAnswers,
    navigate,
    qAnswer,
    question,
    isLastQuestion,
  ]);

  useEffect(() => {
    setQAnswer(answers.find((a) => a.questionId === question.id)?.value ?? '');
  }, [answers, question]);

  return (
    <div className="flex flex-col gap-6">
      <Text as="h2" size="body-large" weight="semibold">
        {question.prompt}
      </Text>
      {question.type === 'short' && (
        <TextInput
          className="w-1/2"
          placeholder="Enter your answer"
          value={qAnswer}
          onChange={setQAnswer}
          onPaste={() => antiCheat.logPaste()}
        />
      )}
      {question.type === 'mcq' && (
        <div className="grid grid-cols-4 gap-2">
          {question.options.map((option) => (
            <Button
              key={option}
              onClick={() => setQAnswer(option)}
              intent={qAnswer === option ? 'primary' : 'default'}
            >
              {option}
            </Button>
          ))}
        </div>
      )}
      {question.type === 'code' && (
        <CodeBlock
          name={`question-${question.id}`}
          language="javascript"
          initialCode={qAnswer}
          onChange={setQAnswer}
          onPaste={() => antiCheat.logPaste()}
        />
      )}
      <div className="flex justify-end space-x-2 mt-4">
        {question.position !== 0 && (
          <Button onClick={onBack} loading={isPending}>
            Back
          </Button>
        )}
        <Button intent="primary" onClick={onSubmitAnswer} loading={isPending}>
          Submit Answer
        </Button>
      </div>
    </div>
  );
};

const PlayQuiz = () => {
  const { state } = useLocation();
  const { quiz } = useMemo(() => state as Attempt, [state]);
  const [qIndex, setQIndex] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    Number(quiz.timeLimitSeconds)
  );

  const navigate = useNavigate();
  const { mutate: submitQuiz } = useSubmitQuizMutation();
  const { getSummary } = useAntiCheatContext();

  useEffect(() => {
    if (remainingSeconds <= 0) {
      submitQuiz(quiz.id, {
        onSuccess: (res) => {
          navigate('/play/result', {
            state: {
              ...res.data,
              quizId: quiz.id,
              antiCheat: getSummary(),
            },
          });
        },
      });
      return;
    }

    const timer = setTimeout(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [remainingSeconds, submitQuiz, quiz.id, navigate, getSummary]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl flex flex-col">
        <Text as="span" className="self-end mb-2">
          Time Left: {remainingSeconds}s
        </Text>
        <div className="bg-white rounded-lg shadow-lg px-8 py-6">
          <Question
            question={quiz.questions[qIndex]}
            onSuccess={() => setQIndex(qIndex + 1)}
            onBack={() => setQIndex(qIndex - 1)}
            isLastQuestion={qIndex === quiz.questions.length - 1}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayQuiz;
