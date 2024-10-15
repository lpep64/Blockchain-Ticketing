# Weighted Front-end Technology Decision Matrix

| Criteria (Weight)               | React        | Angular      | Vue          | Svelte       |
|---------------------------------|--------------|--------------|--------------|--------------|
| Ease of Use (15%)               | 4 (0.60)     | 3 (0.45)     | 5 (0.75)     | 5 (0.75)     |
| Performance (20%)               | 5 (1.00)     | 4 (0.80)     | 5 (1.00)     | 5 (1.00)     |
| Community Support (10%)         | 5 (0.50)     | 4 (0.40)     | 4 (0.40)     | 3 (0.30)     |
| Integration with Backend (15%)  | 5 (0.75)     | 5 (0.75)     | 4 (0.60)     | 4 (0.60)     |
| Ecosystem & Libraries (15%)     | 5 (0.75)     | 5 (0.75)     | 4 (0.60)     | 3 (0.45)     |
| Mobile Development (10%)        | 5 (0.50)     | 4 (0.40)     | 3 (0.30)     | 3 (0.30)     |
| Familiarity (Team) (15%)        | 5 (0.75)     | 3 (0.45)     | 3 (0.45)     | 2 (0.30)     |
|---------------------------------|--------------|--------------|--------------|--------------|
| Total Weighted Score            | 4.85         | 4.00         | 4.10         | 3.70         |

Note: Each cell contains the raw score (0-5) and the weighted score in parentheses.

## Criteria Explanations:

1. **Ease of Use (15%)**: How intuitive and straightforward the framework is for developers.
2. **Performance (20%)**: Runtime performance of applications built with the framework.
3. **Community Support (10%)**: Size and activity of the developer community, availability of resources.
4. **Integration with Backend (15%)**: Ease of integration with various backend technologies, particularly important for our blockchain-based system.
5. **Ecosystem & Libraries (15%)**: Availability of third-party libraries and tools, crucial for rapid development.
6. **Mobile Development (10%)**: Capabilities for developing mobile applications, considering potential future expansion.
7. **Familiarity (Team) (15%)**: Current team's experience with the technology, important for immediate productivity.

## Analysis:

1. **React (4.85)**: Scores highest overall, excelling in performance, community support, and ecosystem. The team's familiarity is a significant advantage.

2. **Vue (4.10)**: Performs well in ease of use and performance, but slightly lower in backend integration and ecosystem compared to React.

3. **Angular (4.00)**: Strong in backend integration and ecosystem, but lower scores in ease of use and team familiarity impact its overall rating.

4. **Svelte (3.70)**: Excellent in ease of use and performance, but lower scores in community support, ecosystem, and team familiarity affect its total score.

## Recommendation:
Based on this weighted decision matrix, **React** is the most suitable choice for our project. Its high scores across all categories, particularly in performance, backend integration, and team familiarity, make it well-suited for developing our blockchain-based ticketing system's front-end.


# Weighted Backend Technology Decision Matrix

| Criteria (Weight)                       | AWS | Google Cloud | Microsoft Azure  | Local Machines | Creating own server       |
|-----------------------------------------|-----|--------------|------------------|----------------|---------------------------|
| Cost (50%)                              | 4   | 5            | 4                | 5              | 1                         |
| Security (20%)                          | 5   | 5            | 5                | 1              | 1                         |
| Support for Blockchain Frameworks (10%) | 4   | 2            | 5                | 1              | 1                         |
| Performance/Scalability (10%)           | 5   | 5            | 5                | 1              | 4                         |
| Ease of Use (10%)                       | 3   | 4            | 5                | 4              | 1                         |
|-----------------------------------------|-----|--------------|------------------|----------------|---------------------------|
| Totals                                  | 4.2 | 4.6          | 4.5              | 3.3            | 1.3                       |

## Breakdown of each criteria and why its weight was chosen
**Cost**
We are a self-funded project and none of our team members have access to significant amounts of funding for this project, thus cost is the most important factor for us to consider by far. We want to keep the costs of the project manageable or ideally free. This is why cost is weighted so high.

**Secuirty**
Security is crucial for our project because it ensures that the system isn't compromised by unauthorized users or exploited to create fraudulent tickets. By preventing fraud, the system maintains trust with both the university and the students, ensuring that only eligible students receive valid tickets. With a blockchain solution, the immutability of the ledger and cryptographic verification provide strong defenses against tampering and ticket duplication.
However, security isn't the biggest factor for a few reasons:
1.	Free Tickets: Since the tickets are distributed for free, the financial incentive for attacks (*e.g., forging tickets for profit*) is much lower compared to systems where tickets are sold at high value. This reduces the likelihood of sophisticated hacking attempts aimed at bypassing security.
2.	User Experience: Given that our system will be used by students, it's essential to prioritize ease of use and accessibility. If the system is overly complex or difficult to use in the name of security, it could discourage students from engaging with it or create unnecessary friction during high-demand periods like game days.
Security is still relatively high priority in the decision matrix as it is always important, however the reasons above express why it isn't our top priority

**Support for Blockchain Frameworks**
It’s important for some existing support for blockchain networks to be integrated into our backend just because nobody on our group has significant experience in creating a blockchain network, so existing support would be very beneficial, however our goal with this project is to learn the technology, so we still will want to do the bulk of the work when creating our network. This is why support for blockchain networks is not weighted very high.

**Performance/Scalability**
Around 1/5 of seats in Gampel are reserved for students, there are ~10,000 seats so roughly 2,500 are for students, meaning there should be around 2,500 tickets per game, let’s assume that everyone transfers their ticket one time after claiming it initially, that means there are 5,000 ticket transactions per game (definitely an overestimate), during peak basketball season the men and women’s teams have around 2.5 home games per week combined, 5000 * 2.5 = 12,500 transactions per week on average during the height of the basketball season. 
Blockchain capabilities are usually measured in transactions per second, converting 12,500 transactions per week into transactions per second gives .02 transactions per second, A network like Ethereum (which we are planning on using) can handle 30 transactions per second, this is all to say that performance shouldn’t be a huge concern here because our problem requires a very small bandwidth of transactions compared to what these cloud networks and blockchain networks are capable of. For this reason, performance/scalability is weighted relatively low.

**Ease of Use**
Ease of use is important to any project, however in this case any challenges we run into with backend will be able to be treated as a learning experience however it is important that we are able to understand the technology we are using. For this reason, ease of use is relatively low, while still being a factor.

## Analysis
1. **Google Cloud (4.6)** Google Cloud is a very solid option for our project, it is the best option for cost and preformance, however it's one weakness is its support for blockchain networks.

2. **Microsoft Azure (4.5)** Azure is the best in every category except cost, which it is still competitive in. This makes it a very strong choice

3. **AWS (4.2)** AWS is a solid option, but seing as its cost isn't as high as other cloud options and its ease of use could be better it comes out as the worst cloud option

4. **Local Machines (3.3)** Local machines would work well for a small scale project, but ours is big enough to make this basically a non factor

5. **Creating own server (1.3)** This was never going to be a super strong choice as the cost of buying our own server machine to run our service on is too high to be a viable solution, however it was still important to consider this option