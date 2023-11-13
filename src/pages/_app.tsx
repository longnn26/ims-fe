import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import store from "@store/index";
import { ConfigProvider } from "antd";

let persistor = persistStore(store);
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#ee4623",
          borderRadius: 2,
          // Alias Token
          // colorBgContainer: "#f6ffed",
        },
      }}
    >
      <SessionProvider session={session}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* Same as */}
        <ToastContainer />
        <Provider store={store}>
          {/* <PersistGate persistor={persistor} loading={null}> */}
          <Component {...pageProps} />
          {/* </PersistGate> */}
        </Provider>
      </SessionProvider>
    </ConfigProvider>
  );
}
