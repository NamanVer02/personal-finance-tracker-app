export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
};

declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
}
  