export default function NotFound() {
  return (
    <div className=" max-w-lg mx-auto text-center py-24">
      <h1 className=" text-3xl font-bold mb-3">404 - pageNotFound</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-5">
        {" "}
        The page you are looking for doesn’t exist.
      </p>
      <a href="/" className="btn btn-primary">
        Go back home
      </a>
    </div>
  );
}
