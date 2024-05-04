import { Drawer, List, Button } from 'antd';
import { useState } from 'react';

const MovementView = ({ open, closeView, movementsData, onClick }) => {
    const [ loading, setLoading ] = useState(false);

    return (
        <Drawer
			placement="right"
			width={450}
            title="Lista delle movimentazioni pendenti"
            open={open}
			closable={true}
            onClose={closeView}
			mask={false}
        >
            <List
                itemLayout="horizontal"
                dataSource={movementsData}
                renderItem={movement => (
                    <List.Item
                        actions={[
                            <Button onClick={() => {onClick(movement.movementId), setLoading(true)}} loading={loading}>
                                Sollecita risposta
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={`Movimento #${movement.movementId}`}
                            description={
                                <div>
                                    <p style={{margin: 0}}>Da scaffalatura: {movement.fromShelfName}, bin: {movement.fromBinString}</p>
                                    <p style={{margin: 0}}>A scaffalatura: {movement.toShelfName}, bin: {movement.toBinString}</p>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Drawer>
    );
};

export default MovementView;
