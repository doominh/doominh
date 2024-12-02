import GridLoader from 'react-spinners/GridLoader';

function LoadingLocal() {
  return (
    <div className="flex justify-center py-36">
      <GridLoader
        size={48}
        className="left-1/2 top-1/2  "
        loading
        color="#FF4757"
      />
    </div>
  );
}
export default LoadingLocal;
