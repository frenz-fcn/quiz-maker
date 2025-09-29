import { Link } from 'react-router-dom';
import { Button, Text } from './../components';

const Home = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white text-center p-10 rounded-lg shadow-lg">
        <Text as="h1" size="title" weight="semibold" className="mb-2">
          Quiz Maker
        </Text>
        <Text size="body-large" color="subtle" className="mb-8 max-w-md">
          Create, share, and play quizzes in just a few clicks.
        </Text>
        <div className="flex items-center justify-center space-x-2 flex-row mt-4">
          <Link to="/builder">
            <Button intent="primary">Create a Quiz</Button>
          </Link>
          <Link to="/play">
            <Button variant="ghost" intent="default">
              Take a Quiz
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
