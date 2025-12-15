"""add payment fields to bookings

Revision ID: add_payment_fields
Revises: 
Create Date: 2025-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_payment_fields'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add payment fields to bookings table
    op.add_column('bookings', sa.Column('payment_status', sa.String(), nullable=False, server_default='pending'))
    op.add_column('bookings', sa.Column('payment_intent_id', sa.String(), nullable=True))
    op.add_column('bookings', sa.Column('stripe_payment_method', sa.String(), nullable=True))
    op.add_column('bookings', sa.Column('amount_paid', sa.Float(), nullable=True))


def downgrade():
    # Remove payment fields from bookings table
    op.drop_column('bookings', 'amount_paid')
    op.drop_column('bookings', 'stripe_payment_method')
    op.drop_column('bookings', 'payment_intent_id')
    op.drop_column('bookings', 'payment_status')

