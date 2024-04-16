export default interface DefaultButtonType {
  children: string;
  buttonType: 'button' | 'submit' | 'reset' | undefined;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  size: string;
  color: string;
}