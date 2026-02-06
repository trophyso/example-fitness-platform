<a id="readme-top"></a>

<br />

<div align="center">
  <a href="https://github.com/trophyso/example-fitness-platform">
    <img src="assets/logo_dark.svg" alt="Trophy" width="250" height="50">
  </a>

<h3 align="center">Example Fitness Platform</h3>
  <p align="center">
    A Strava-lite fitness tracker built with Next.js showing how to build high-retention consumer apps with Trophy.
    <br />
    <a href="https://docs.trophy.so/guides/tutorials/how-to-build-a-fitness-app">
        <strong>Tutorial »</strong>
    </a>
    <a href="http://trophy.so?utm_source=github&utm_medium=example-apps&utm_campaign=example-fitness-app">
        <strong>Trophy »</strong>
    </a>
    <br />
    <br />
    <a href="https://github.com/trophyso/example-fitness-platform">View Demo</a>
    &middot;
    <a href="https://github.com/trophyso/example-fitness-platform/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/trophyso/example-fitness-platform/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- Placeholder for Demo Video -->
<!--
<div align="center">
  <video width="75%" autoplay loop muted playsinline style="border-radius: 12px;">
    <source src="assets/demo.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>
<br />
-->

This is a comprehensive example of a consumer fitness application (like Strava or Nike Run Club) powered by Trophy. It demonstrates how to handle multiple activity types, complex leaderboards, and a unified progression system.

**Key Features:**
*   **Multi-Sport Tracking:** Log Runs, Rides, and Swims with specific attributes (Pace, Style).
*   **XP Normalization:** A unified "Level" system that weights activities fairly (e.g., 1km Swim > 1km Cycle).
*   **Advanced Leaderboards:** Switch between "Global" and "City" views to see local rankings.
*   **Activity Streaks:** A daily consistency loop that rewards simply showing up.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- **Next.js 15** (App Router)
- **Shadcn/UI** & **TailwindCSS**
- **Lucide Icons**
- **Recharts** for visualizations
- **Trophy** for the gamification engine

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

First:

```bash
npm install
```

Then:

```bash
npm run dev
```

### Prerequisites

To use the gamification features, you'll need a Trophy account.

1.  **Create an Account:** [Sign up at Trophy.so](http://app.trophy.so/sign-up?utm_source=github&utm_medium=example-apps&utm_campaign=example-fitness-app).
2.  **Get your API Key:** Copy it from the [Developer Settings](https://app.trophy.so/settings/developer).
3.  **Configure Environment:**

```bash
cp .env.example .env.local
```

```bash
TROPHY_API_KEY='Your API key'
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Trophy - hello@trophy.so

Project Link: [https://github.com/trophyso/example-fitness-platform](https://github.com/trophyso/example-fitness-platform)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
