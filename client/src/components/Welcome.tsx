interface WelcomeProps {
  name: string
}

function Welcome({ name }: WelcomeProps) {
  return (
    <div>
      <h1>Welcome {name}</h1>
      <p>Let's build our application.</p>
    </div>
  )
}

export default Welcome