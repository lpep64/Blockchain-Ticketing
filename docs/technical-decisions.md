# Weighted Frontend Technology Decision Matrix

| Criteria (Weight)               | Vue          | React        | Angular      | Svelte       |
|---------------------------------|--------------|--------------|--------------|--------------|
| Ease of Use (20%)               | 5            | 4            | 3            | 5            |
| Performance (15%)               | 5            | 5            | 4            | 5            |
| Learning Curve (15%)            | 5            | 4            | 3            | 4            |
| Flexibility (15%)               | 5            | 4            | 3            | 4            |
| Integration with Backend (10%)  | 4            | 5            | 5            | 4            |
| Build Size & Performance (10%)  | 5            | 4            | 3            | 5            |
| Community Growth (10%)          | 4            | 5            | 4            | 3            |
| Progressive Framework (5%)      | 5            | 3            | 4            | 3            |
|---------------------------------|--------------|--------------|--------------|--------------|
| Total Weighted Score            | 4.80         | 4.30         | 3.50         | 4.30         |

Note: Each cell contains the raw score (0-5) and the weighted score in parentheses.

## Criteria Explanations:

1. **Ease of Use (20%)**: Intuitiveness and straightforwardness of the framework for developers.
2. **Performance (15%)**: Runtime performance of applications built with the framework.
3. **Learning Curve (15%)**: Time and effort required for developers to become productive.
4. **Flexibility (15%)**: Ability to adapt to various project sizes and integrate with other tools.
5. **Integration with Backend (10%)**: Ease of integration with various backend technologies.
6. **Build Size & Performance (10%)**: Efficiency of the build output and loading performance.
7. **Community Growth (10%)**: Rate of growth and vitality of the developer community.
8. **Progressive Framework (5%)**: Ability to be adopted incrementally in projects.

## Analysis:

1. **Vue (4.80)**: Excels in ease of use, has a gentle learning curve, and offers great flexibility. Its performance is on par with React and Svelte, and it shines in build size efficiency. Vue's progressive nature allows for incremental adoption, which can be beneficial for our project.

2. **React (4.30)**: Strong overall, but slightly more complex than Vue with a steeper learning curve. While it has excellent community support, it lacks the progressive framework approach that Vue offers.

3. **Svelte (4.30)**: Matches Vue in several areas but falls short in community growth and progressive framework capabilities. 

4. **Angular (3.50)**: While robust, it has a steeper learning curve and less flexibility compared to Vue, which could slow down our development process.

## Recommendation:
Based the decision matrix, **Vue** emerges as the most suitable choice for our project. Its combination of ease of use, performance, and flexibility make it an excellent fit for developing our blockchain-based ticketing system's front-end. Vue's gentle learning curve will allow our team to become productive quickly, while its progressive nature provides the flexibility to scale our application as needed.

The ability to incrementally adopt Vue features aligns well with the potentially evolving nature of our blockchain ticketing system. Furthermore, Vue's efficient build size will be beneficial for maintaining fast load times, crucial for a ticketing application where speed is essential.



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
### Cost ###
We are a self-funded project and none of our team members have access to significant amounts of funding for this project, thus cost is the most important factor for us to consider by far. We want to keep the costs of the project manageable or ideally free. This is why cost is weighted so high.

### Secuirty ###
Security is crucial for our project because it ensures that the system isn't compromised by unauthorized users or exploited to create fraudulent tickets. By preventing fraud, the system maintains trust with both the university and the students, ensuring that only eligible students receive valid tickets. With a blockchain solution, the immutability of the ledger and cryptographic verification provide strong defenses against tampering and ticket duplication.
However, security isn't the biggest factor for a few reasons:
1.	Free Tickets: Since the tickets are distributed for free, the financial incentive for attacks (*e.g., forging tickets for profit*) is much lower compared to systems where tickets are sold at high value. This reduces the likelihood of sophisticated hacking attempts aimed at bypassing security.
2.	User Experience: Given that our system will be used by students, it's essential to prioritize ease of use and accessibility. If the system is overly complex or difficult to use in the name of security, it could discourage students from engaging with it or create unnecessary friction during high-demand periods like game days.
Security is still relatively high priority in the decision matrix as it is always important, however the reasons above express why it isn't our top priority

### Support for Blockchain Frameworks ###
It’s important for some existing support for blockchain networks to be integrated into our backend just because nobody on our group has significant experience in creating a blockchain network, so existing support would be very beneficial, however our goal with this project is to learn the technology, so we still will want to do the bulk of the work when creating our network. This is why support for blockchain networks is not weighted very high.

### Performance/Scalability ###
Around 1/5 of seats in Gampel are reserved for students, there are ~10,000 seats so roughly 2,500 are for students, meaning there should be around 2,500 tickets per game, let’s assume that everyone transfers their ticket one time after claiming it initially, that means there are 5,000 ticket transactions per game (definitely an overestimate), during peak basketball season the men and women’s teams have around 2.5 home games per week combined, 5000 * 2.5 = 12,500 transactions per week on average during the height of the basketball season. 
Blockchain capabilities are usually measured in transactions per second, converting 12,500 transactions per week into transactions per second gives .02 transactions per second, A network like Ethereum (which we are planning on using) can handle 30 transactions per second, this is all to say that performance shouldn’t be a huge concern here because our problem requires a very small bandwidth of transactions compared to what these cloud networks and blockchain networks are capable of. For this reason, performance/scalability is weighted relatively low.

### Ease of Use ###
Ease of use is important to any project, however in this case any challenges we run into with backend will be able to be treated as a learning experience however it is important that we are able to understand the technology we are using. For this reason, ease of use is relatively low, while still being a factor.

## Analysis
1. **Google Cloud (4.6)** Google Cloud is a very solid option for our project, it is the best option for cost and preformance, however it's one weakness is its support for blockchain networks.

2. **Microsoft Azure (4.5)** Azure is the best in every category except cost, which it is still competitive in. This makes it a very strong choice

3. **AWS (4.2)** AWS is a solid option, but seing as its cost isn't as high as other cloud options and its ease of use could be better it comes out as the worst cloud option

4. **Local Machines (3.3)** Local machines would work well for a small scale project, but ours is big enough to make this basically a non factor

5. **Creating own server (1.3)** This was never going to be a super strong choice as the cost of buying our own server machine to run our service on is too high to be a viable solution, however it was still important to consider this option