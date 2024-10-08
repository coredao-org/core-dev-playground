import {Col, Row, Space} from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

import ProtocolLogo from 'components/icons';
import {CHAINS_CONFIG} from 'lib/constants';
import {CHAINS, UserActivity} from 'types';
import {colors, getChainColors} from 'utils/colors';
import {trackEvent} from 'utils/tracking-utils';

const PROTOCOL_BOX_LENGTH = 100;
const PROTOCOL_ICON_LENGTH = 30;

const Home = () => {
  return (
    <Wrapper>
      <Container span={16} offset={4}>
        <Title>
          Core Learning Pathway{' '}
          <Brand>
            by{' '}
            <a href="https://coredao.org/" target="_blank" rel="noreferrer">
              Core
            </a>
          </Brand>
        </Title>
        {/*<Row>
          <Col span={6}>
            <ChainRow title={'Storage'}>
              <Protocol chain={CHAINS.GREENFIELD} />
            </ChainRow>
          </Col>
          </Row>*/}
        <Row>
          <Col span={24}>
            <ChainRow title={'Building a Web3 Application'}>
              <Protocol chain={CHAINS.CORE} />
            </ChainRow>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};

const Protocol = ({chain}: {chain: CHAINS}) => {
  const {id, active, label} = CHAINS_CONFIG[chain];
  const {primaryColor, secondaryColor} = getChainColors(chain as CHAINS);

  const box = (
    <ProtocolBox
      key={id}
      active={active}
      primary_color={primaryColor}
      secondary_color={secondaryColor}
      onClick={() => {
        trackEvent(UserActivity.PROTOCOL_CLICKED, {
          protocolId: chain,
          protocolName: label,
        });
      }}
    >
      {!active && (
        <ComingSoon align="middle" justify="center">
          Soon!
        </ComingSoon>
      )}
      <ProtocolLogo chainId={chain} size={PROTOCOL_ICON_LENGTH} />
      <Label>{label}</Label>
    </ProtocolBox>
  );

  return active ? (
    <Link href={`/${id}`} key={id}>
      {box}
    </Link>
  ) : (
    box
  );
};

const ChainRow = ({
  title,
  children,
}: {
  title: string;
  children: any | any[];
}) => {
  return (
    <SectionContainer>
      <SectionTitle>{title}</SectionTitle>
      <Space size="large" wrap>
        {children}
      </Space>
    </SectionContainer>
  );
};

const Wrapper = styled.div`
  background: ${colors.darkBackground};
  width: 100vw;
  height: 100vh;
`;

const Container = styled(Col)`
  padding-top: 60px;
`;

const Title = styled.h1`
  font-size: 3.5em;
  margin-bottom: 60px;
  color: white;
  text-align: center;
`;

const Brand = styled.span`
  color: ${colors.coreOrange};
  font-size: 0.6em;

  a {
    color: ${colors.coreOrange};
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SectionContainer = styled(Col)`
  margin-bottom: 40px;
  padding-right: 30px;
`;

const SectionTitle = styled.div`
  font-size: 1.5em;
  margin-bottom: 20px;
  color: white;
  font-weight: 500;
  color: ${colors.coreOrange};
  border-bottom: solid 1px rgb(255 242 155 / 35%);
`;

const ProtocolBox = styled.div<{
  active: boolean;
  primary_color: string;
  secondary_color: string;
}>`
  position: relative;

  height: ${PROTOCOL_BOX_LENGTH}px;
  width: ${PROTOCOL_BOX_LENGTH}px;
  border: solid 1px #eee;
  background-color: #f8f8f8;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${({active, primary_color, secondary_color}) =>
    active &&
    `
		&:hover {
			border: none;
			color: ${primary_color};
			background: ${secondary_color};
			cursor: pointer;
		}
	`}

  &:hover > svg {
    path {
      fill: ${({secondary_color}) => `${secondary_color}`};
    }
  }
`;

const PENDING_LENGTH = 42;

const ComingSoon = styled(Row)`
  position: absolute;
  height: ${PENDING_LENGTH}px;
  width: ${PENDING_LENGTH}px;
  top: -12px;
  right: -12px;
  text-align: center;
  background: ${colors.coreOrange};
  border-radius: 50%;
  font-size: 0.8em;
  color: #555;
  font-weight: 500;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

export default Home;
