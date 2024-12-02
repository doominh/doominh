import GridLoader from 'react-spinners/GridLoader';

function LoadingPage({ loading }: { loading: boolean }) {
  return (
    <div className="dark:bg-cs_dark relative flex h-screen flex-col items-center justify-center bg-base-100 py-16">
      <div className="mt-8 flex flex-col items-center ">
        <GridLoader size={36} loading={loading} color="#FF4757" />
      </div>
    </div>
  );
}

export default LoadingPage;
