// modules
import styled, { css } from 'styled-components';

export const Button = styled.button`
  background-color: #C68728;
  color: #432929;
  width: 20.5rem;
  padding: 1.2rem 0;
  border-radius: 1rem;
  font-family: 'Fredoka', sans-serif;
  border: 3px solid #432929;
  border-top: 1px solid #432929;
  border-bottom: 6px solid #432929;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  ${({ disabled }) => disabled && css`
    opacity: .7;
    cursor: not-allowed;
  `}
`;

export const MiniButton = styled(Button)`
padding: .6rem 1.2rem;
font-size: 1rem;
border-radius: .7rem;
border: 2px solid #432929;
border-top: 1px solid #432929;
border-bottom: 4px solid #432929;
margin-left: 1rem;
width: fit-content;
`;

export const PuckButton = styled.button`
  cursor: pointer;
  padding: .2rem .3rem;
  border: none;
  background-color: transparent;
  border: 1px solid #432929;
  color: #432929;
  font-family: inherit;
  font-weight: 600;
  border-radius: .7rem;
  font-size: .6rem;
  &:hover {
    border: 1px solid white;
  }
`;
