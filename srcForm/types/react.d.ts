interface ForwardRefWithGenerics extends React.FC<WithForwardRefProps<Option>> {
  <T extends Option>(props: WithForwardRefProps<T>): ReturnType<React.FC<WithForwardRefProps<T>>>
}
