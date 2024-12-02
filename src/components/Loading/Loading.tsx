import GridLoader from 'react-spinners/GridLoader';
function Loading() {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-[9999] bg-black bg-opacity-50"></div>
      <GridLoader
        size={48}
        className="fixed left-1/2 top-1/2 z-[9999] "
        loading
        color="#fff"
      />
    </>
  );
}
export default Loading;
