import React, { InputHTMLAttributes, ReactNode } from 'react'
import styled from '@emotion/styled';
import { css } from '@emotion/react';

const InputContainer = styled.input<{ icon?: ReactNode }>`
    border: 1px solid  #E9E9E9;
    border-radius: 5px;
    padding: 4px 9px;
    font-size: 13px;
    font-weight: 400;
    ${props => props.icon && "padding-Right: 10px;"}
    
    &:focus {
        outline: none;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.4);
    }
`;

type Props = InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode };

function TextInput(props : Props) {
  return (
    <div css={css({ position: "relative" })}>
      <InputContainer icon={props.icon} {...props} />
      {props.icon && <div css={css({ position: 'absolute', top: "50%", right: "4px", transform: "translateY(-50%)" })}>{props.icon}</div>}
    </div>
  );
}

export default TextInput;