import Head from 'next/head';
import Layout, { siteTitle } from '../components/Layout';
import styled from 'styled-components';
import Subscribe from '../components/ Subscribe';

const HeroSection = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: rgb(152, 200, 245); */
`;

const HeroContainer = styled.div`
  height: 100vh;
  margin-top: 10vh;
  max-width: 900px;
  width: 90vw;
`;

const Section = styled.section`
  width: 100%;
`;

const Container = styled.div`
  /* max-width: 900px;
  width: 90vw; */
`;

const Home = () => (
  <Layout>
    <Head>
      <title>{siteTitle}</title>
    </Head>

    <HeroSection>
      <HeroContainer>
        <h1>
          Bookmark
          <br />
          Organize
          <br />
          Share
        </h1>
        <p>
          {siteTitle} helps you bookmark and organize all your links in folders
          <br />
          so you can quickly grab them and share them whenever you want.
        </p>
        <h4>We’re in private beta. Drop in your email for updates.</h4>
        <Subscribe />
      </HeroContainer>
    </HeroSection>
    <Section>
      <Container>
        <h1></h1>
        <p></p>
      </Container>
    </Section>
  </Layout>
);

export default Home;
