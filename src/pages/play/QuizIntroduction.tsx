import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Text } from '../../components';
import type { Attempt } from '../../types';

const QuizIntroduction = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const attempt = state as Attempt;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg px-8 py-6 w-full max-w-xl flex flex-col gap-8">
        <Text as="h1" size="heading" weight="bold" color="brand">
          Welcome!
        </Text>
        <section className="space-y-2">
          <Text as="h2" size="subheading" weight="semibold">
            Instructions
          </Text>
          <ol className="list-decimal pl-4 space-y-2">
            <li>
              <Text as="p" size="body">
                This is a timed quiz.
              </Text>
            </li>
            <li>
              <Text as="p" size="body">
                Please make sure you are not interrupted during the quiz.
              </Text>
            </li>
            <li>
              <Text as="p" size="body">
                The timer cannot be paused once started.
              </Text>
            </li>
          </ol>
        </section>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col">
            <Text weight="semibold">Test duration</Text>
            <Text color="subtle">{attempt.quiz.timeLimitSeconds} secs</Text>
          </div>
          <div className="flex flex-col">
            <Text weight="semibold">No. of questions</Text>
            <Text color="subtle">
              {attempt.quiz.questions.length} questions
            </Text>
          </div>
        </div>
        <section className="space-y-2">
          <Text as="h2" size="subheading" weight="semibold">
            Questions
          </Text>
          <ol className="list-decimal pl-4 space-y-2">
            <li>
              <Text as="p" size="body">
                Multiple Choice Question
              </Text>
            </li>
            <li>
              <Text as="p" size="body">
                Short Answer Question
              </Text>
            </li>
            <li>
              <Text as="p" size="body">
                Coding Question{' '}
                <span className="text-subtle italic">
                  (Feel free to choose your preferred programming language)
                </span>
              </Text>
            </li>
          </ol>
        </section>
        <div className="flex space-x-2">
          <Button size="lg" variant="text" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button
            intent="primary"
            size="lg"
            fullWidth
            onClick={() =>
              navigate('/play/quiz', {
                state: attempt,
              })
            }
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizIntroduction;
