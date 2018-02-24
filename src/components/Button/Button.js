import styled from 'styled-components'

const Button = styled.button`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 1rem;
  border-radius: 3px;
  padding: 0.25em 1em;
  background: royalblue;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    color: #000;
    opacity: 0.85;
  }
`
export default Button
