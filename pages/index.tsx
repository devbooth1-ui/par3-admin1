// Redirect / to /login
export function getServerSideProps() {
  return { redirect: { destination: '/login', permanent: false } };
}
export default function Index() { return null; }
