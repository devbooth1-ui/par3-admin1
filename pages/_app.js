import { AuthProvider } from '../hooks/useAuth'; // Update the path if needed
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}
