import "@/app/_styles/globals.css";
import { Josefin_Sans } from "next/font/google";
import { PropsWithChildren } from "react";
import Header from "./_components/Header";
import Providers from "./providers";
import { Toaster } from 'react-hot-toast';

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s / The Wild Oasis",
    default: "Welcome / The Wild Oasis",
  },
  description:
    "Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col relative`}
      >
        <Header />

        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full">
            <Providers>
              {children}

              <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  
                  style: {
                    background: '#363636',
                    color: '#fff',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    backdropFilter: 'blur(16px)',
                  },
                  success: {
                    style: {
                      border: '1px solid #10b981',
                      background: '#10b98115',
                    },
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    style: {
                      border: '1px solid #ef4444',
                      background: '#ef444414',
                    },
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </Providers>
          </main>
        </div>
      </body>
    </html>
  );
}
