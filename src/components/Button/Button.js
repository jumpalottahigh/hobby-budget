import styled from 'styled-components'

const Button = styled.button`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 1rem;
  width: 80px;
  border-radius: 3px;
  padding: 0.25em 1em;
  background: #5bc0de;
  color: white;
  border: 2px solid #5bc0de;
  cursor: pointer;

  &:hover {
    background-color: #31b0d5;
  }
`
export default Button
