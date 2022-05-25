import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Public } from '../auth/public.decorator';
import { UsersService } from '../users/users.service';
@Controller('api/stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private userService: UsersService
  ) {}

  @Get('session')
  async getCheckoutSession(@Req() req) {
    const hasSubscription = await this.stripeService.hasSubscription(
      req.userFromDatabase
    );

    if (hasSubscription) {
      return;
    } else {
      return this.stripeService.getCheckoutSessionId(req.userFromDatabase);
    }
  }

  @Get('update-subscription')
  async updatePaymentMethod(@Req() req) {
    const hasSubscription = await this.stripeService.hasSubscription(
      req.userFromDatabase
    );

    if (!hasSubscription) {
      return;
    } else {
      const session = await this.stripeService.getUpdateSession(
        req.userFromDatabase
      );

      return { url: session.url };
    }
  }

  @Public()
  @Get('payment-successful')
  async paymentSuccessful(@Query() query, @Res() res) {
    const customer = await this.stripeService.getSession(query.session);
    const user = await this.userService.findByEmail(query.email);
    user.stripeCustomer = customer.customer as string;
    await this.userService.update(user);

    res.redirect(process.env.FRONTEND_URL);
  }

  @Get('has-subscription')
  async hasSubscription(@Req() req) {
    return this.stripeService.hasSubscription(req.userFromDatabase);
  }

  @Get('subscription')
  async subscription(@Req() req) {
    if (!req.userFromDatabase.stripeCustomer) {
      return false;
    }

    const subscriptions = await this.stripeService.getSubscriptions(
      req.userFromDatabase.stripeCustomer
    );

    return subscriptions.data.length > 0 ? subscriptions.data[0] : undefined;
  }

  @Get('resubscribe')
  async resubscribe(@Req() req) {
    if (!req.userFromDatabase.stripeCustomer) {
      return;
    }

    const subscriptions = await this.stripeService.getSubscriptions(
      req.userFromDatabase.stripeCustomer
    );

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      subscription.cancel_at_period_end = false;
      await this.stripeService.updateSubscription(subscription);
    }
  }

  @Get('cancel-subscription')
  async cancelSubscription(@Req() req) {
    if (!req.userFromDatabase.stripeCustomer) {
      return;
    }

    const subscriptions = await this.stripeService.getSubscriptions(
      req.userFromDatabase.stripeCustomer
    );

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      subscription.cancel_at_period_end = true;
      await this.stripeService.updateSubscription(subscription);
    }
  }
}
