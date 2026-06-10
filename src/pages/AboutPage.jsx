function AboutPage() {
    return (
        <>
            <h2>About This App</h2>
            <section>
                <h3>App Features</h3>
                <ul>
                    <li>Add, edit, and complete todos</li>
                    <li>Filter todos by status (all, active, completed)</li>
                    <li>Sort todos by creation date or title</li>
                    <li>Search todos by title</li>
                    <li>User authentication with login and logout</li>
                    <li>Protected routes for authenticated users</li>
                </ul>
            </section>
            <section>
                <h3>Technologies Used</h3>
                <ul>
                    <li>React</li>
                    <li>React Router</li>
                    <li>Vite</li>
                </ul>
            </section>
        </>
    )
}

export default AboutPage; 

