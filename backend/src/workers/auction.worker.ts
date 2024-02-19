// import { BidService } from "src/services/bid.service";

// function delay(ms: number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// const doWork = async (bidService: BidService) => {
//     console.log(`Current time is ${Date.now()} | Worker start now`);
//     await bidService.checkBidAuction();
//     await delay(1000);
// };

// export const worker = async (bidService: BidService) => {
//     // Worker runner
//     // eslint-disable-next-line
//     while (true) {
//         try {
//             await doWork(bidService); // eslint-disable-line
//         } catch (err) {
//             console.error(err, 'error in worker');
//         } finally {
//             console.info('done');
//         }
//     }
// };