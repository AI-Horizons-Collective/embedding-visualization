import { FC } from 'react';
import { Layout, Menu } from 'antd';
import { css } from '@emotion/css';
import { useAtom } from 'jotai';
import { match } from 'ts-pattern';
import { activeMenuAtom, menusAtom } from '../store';
import { DataPreparation } from '../features/data-preparation';
import { MenuEnum } from '../types';
import { FullDimensionalHeatMap } from '../features/full-dimensional-heat-map';

const classes = {
  layout: css`
    height: 100vh;
  `,
  sider: css``,
  content: css``,
};
export const DefaultLayout: FC = () => {
  const [menus] = useAtom(menusAtom);
  const [activeMenu, setActiveMenu] = useAtom(activeMenuAtom);
  return (
    <Layout className={classes.layout}>
      <Layout.Sider className={classes.sider} theme="light" width={120}>
        <Menu
          items={menus}
          selectedKeys={[activeMenu]}
          activeKey={activeMenu}
          defaultSelectedKeys={[activeMenu]}
          onClick={({ key }) => {
            setActiveMenu(key as MenuEnum);
          }}
        />
      </Layout.Sider>
      <Layout.Content className={classes.content}>
        {match(activeMenu)
          .with(MenuEnum.DataPreparation, () => <DataPreparation />)
          .with(MenuEnum.FullDimensionalHeatMap, () => (
            <FullDimensionalHeatMap />
          ))
          .otherwise(() => (
            <div>404</div>
          ))}
      </Layout.Content>
    </Layout>
  );
};
