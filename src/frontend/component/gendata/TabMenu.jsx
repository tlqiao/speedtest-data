import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import './tabMenu.less';

const TabMenu = () => {
    return (
        <Menu className="menu-container" mode="horizontal">
            <Menu.Item key="schemas" className="menu-item">
                <Link to="/schemas">Schemas</Link>
            </Menu.Item>
            <Menu.Item key="datasets" className="menu-item">
                <Link to="/datasets">Datasets</Link>
            </Menu.Item>
        </Menu>
    );
}
export default TabMenu;
