import { FC } from 'react';
import { Layout, Menu } from 'antd';
import { css } from '@emotion/css';
import { useAtom } from 'jotai';
import { match } from 'ts-pattern';
import { activeMenuAtom, menusAtom } from '../store';
import { DataPreparation } from '../features/data-preparation';
import { MenuEnum } from '../types';
import { FullDimensionalHeatMap } from '../features/full-dimensional-heat-map';
import { Scatter2d } from '../features/scatter-2d';
import { Scatter3d } from '../features/scatter-3d';

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
          .with(MenuEnum.Scatter2D, () => <Scatter2d />)
          .with(MenuEnum.Scatter3D, () => <Scatter3d />)
          .otherwise(() => (
            <div>404</div>
          ))}
      </Layout.Content>
    </Layout>
  );
};
