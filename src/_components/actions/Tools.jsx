import { useState } from 'react';
import { FloatButton, Tooltip } from 'antd';
import { TableOutlined, DropboxOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';

const Tools = ( {openShelfDrawer, openProductDrawer, openMovementView} ) => {
	const [open, setOpen] = useState(false);

	const toggleVisibility = () => {
		setOpen(!open);
	};

	return (
		<div id="tools">
			<Tooltip title='Apri lista movimenti' placement='left'>
				<FloatButton 
					onClick={openMovementView}
					style={{
						right: 80,
					}}
					icon={<SwapOutlined />} 
				/>
			</Tooltip>
			<FloatButton.Group
				open={open}
				trigger="click"
				onClick={toggleVisibility}
				style={{
					right: 24,
				}}
				icon={<PlusOutlined />}
			>
				<Tooltip title='Aggiungi scaffalatura' placement='left'>
					<FloatButton 
						onClick={openShelfDrawer}
						icon={<TableOutlined />} 
					/>
				</Tooltip>
				<Tooltip title='Aggiungi prodotto' placement='left'>
					<FloatButton 
						onClick={openProductDrawer}
						icon={<DropboxOutlined />} 
					/>
				</Tooltip>
			</FloatButton.Group>
		</div>
	);
};

export default Tools;