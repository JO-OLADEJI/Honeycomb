// modules
import styled, { css } from 'styled-components';

export const Button = styled.button`
  background-color: #C68728;
  color: #432929;
  width: 21.8rem;
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
