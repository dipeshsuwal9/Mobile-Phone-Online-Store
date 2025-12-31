from django.core.management.base import BaseCommand, CommandError
from customers.models import Customer


class Command(BaseCommand):
    help = 'Delete a user by email address'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            required=True,
            help='Email address of the user to delete'
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Skip confirmation prompt'
        )

    def handle(self, *args, **options):
        email = options['email']
        force = options['force']

        try:
            user = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            raise CommandError(f'User with email "{email}" does not exist')

        # Show user information
        self.stdout.write(self.style.WARNING(
            f'\nUser found:\n'
            f'  ID: {user.customer_id}\n'
            f'  Name: {user.name}\n'
            f'  Email: {user.email}\n'
            f'  Phone: {user.phone or "N/A"}\n'
            f'  Joined: {user.date_joined}\n'
            f'  Active: {user.is_active}\n'
            f'  Staff: {user.is_staff}\n'
        ))

        # Confirmation prompt
        if not force:
            confirm = input(
                f'\nAre you sure you want to delete user "{user.name}" ({email})? '
                f'This action cannot be undone. Type "yes" to confirm: '
            )
            if confirm.lower() != 'yes':
                self.stdout.write(self.style.WARNING('Deletion cancelled.'))
                return

        # Delete the user
        user.delete()
        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully deleted user "{user.name}" ({email})')
        )
