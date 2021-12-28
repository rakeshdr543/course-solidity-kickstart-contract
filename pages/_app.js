import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import { Container, Header, Menu } from "semantic-ui-react";
import Head from "next/head";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <Container>
      <Head>
        <Menu style={{ marginTop: "10px" }}>
          <Link href="/">
            <a className="item">CrowdCoin</a>
          </Link>

          <Menu.Menu position="right">
            <Link href="/">
              <a className="item">Campaigns</a>
            </Link>

            <Link href="/campaigns/new">
              <a className="item">+</a>
            </Link>
          </Menu.Menu>
        </Menu>
      </Head>
      <Header />
      <Component {...pageProps} />
    </Container>
  );
}

export default MyApp;
