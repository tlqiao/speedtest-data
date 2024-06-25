import { useCallback, useState } from 'react';
import { Menu } from 'antd';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import { last, first } from 'lodash';

import styles from './index.module.less';

const MenuItem = Menu.Item;

const menus = [{
  name: 'Gen Fake Data',
  path: '/',
}, {
  name: 'Gen SQL',
  path: '/gen-sql',
}]

const pathToArr = (path) => {
  return path.split('/').filter((item) => !!item);
};

const Layout = () => {
  const location = useLocation();
  const { pathname } = location;
  const pathArr = pathToArr(pathname);

  const [openKeys, setOpenKeys] = useState(() => {
    const firstKey = first(pathArr);
    return firstKey ? [firstKey] : [];
  });

  const [selectedKey, setSelectedKey] = useState(() => {
    const lastKey = last(pathArr);
    const firstKey = first(pathArr) || '';
    return pathArr.length > 1 ? `${firstKey}-${lastKey}` : firstKey;
  });

  const handleOpenChange = useCallback((openKeys) => {
    const lastKey = last(openKeys)

    const newOpenKeys = lastKey ? [lastKey] : [];
    setOpenKeys(newOpenKeys);
  }, []);

  const handleChange = useCallback(({ key }) => {
    setSelectedKey(key);
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.sider}>
        <div className={styles.logo}>TestData</div>
        <Menu
          className={styles.menus}
          openKeys={openKeys}
          selectedKeys={[selectedKey]}
          onOpenChange={handleOpenChange}
          onClick={handleChange}
          mode="inline"
        >
          {menus.map((menu) => (<MenuItem key={menu.name}>
          <NavLink to={menu.path}>
            {menu.name}
          </NavLink>
        </MenuItem>))}
        </Menu>
      </div>
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
