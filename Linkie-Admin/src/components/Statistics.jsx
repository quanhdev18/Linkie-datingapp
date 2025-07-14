import { Card, Col, Row, Statistic } from 'antd';
import CountUp from 'react-countup';
const formatter = (value) => (
    <CountUp
        end={value}
        separator=","
        decimals={value % 1 === 0 ? 0 : 2}
    />
);


function Statistics({ data }) {


    return (
        <Row gutter={16}>
            {data.map((item, index) => (
                <Col key={index} span={6}>
                    <Card variant="borderless" className='shadow-2xl'>
                        <Statistic
                            formatter={formatter}
                            title={item.name}
                            value={item.number}
                            precision={2}
                            valueStyle={{ color: item.color }}
                            prefix={item.icon}
                            suffix={item.unit}
                        />
                    </Card>
                </Col>
            ))}

        </Row>
    );

}

export default Statistics