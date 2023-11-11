import React, { createContext, useMemo, useState, useContext } from "react";
import noop from "lodash/noop";

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string };

type SelectedMenu = { id?: MenuIds };

type MenuSelected = {
  selectedMenu: SelectedMenu;
};
const MenuSelectedContext = createContext<MenuSelected>({ selectedMenu: {} });

type MenuAction = {
  onSelectedMenu: (menu: SelectedMenu) => void;
};

const MenuActionContext = createContext<MenuAction>({
  onSelectedMenu: noop,
});

type PropsProvider = {
  children: React.ReactNode;
};

function MenuProvider({ children }: PropsProvider) {
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({});

  const menuContextAction = useMemo(() => ({
    onSelectedMenu: (menu: SelectedMenu) => {
      setSelectedMenu(menu);
    },
  }), []);

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={{ selectedMenu }}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[];
};

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext(MenuActionContext);
  const { selectedMenu } = useContext(MenuSelectedContext);

  const handleMenuClick = (menuId: MenuIds) => {
    onSelectedMenu({ id: menuId });
  };

  return (
    <div>
      <ul>
        {menus.map((menu) => (
          <li
            key={menu.id}
            onClick={() => handleMenuClick(menu.id)}
            className={selectedMenu.id === menu.id ? "selected" : ""}
          >
            {menu.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}