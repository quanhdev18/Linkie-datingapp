from sqlalchemy.orm import Session
# from app.models import Package, Purchase
from app.models.package import Package
from app.models.purchase import Purchase

from app.schemas.package import PackageCreate

def create_package(db: Session, data: PackageCreate):
    package = Package(**data.dict())
    db.add(package)
    db.commit()
    db.refresh(package)
    return package

def get_all_packages(db: Session):
    return db.query(Package).all()

def create_purchase(db: Session, user_id: int, package_id: int, vnp_txn_ref: str):
    purchase = Purchase(
        user_id=user_id,
        package_id=package_id,
        status="pending",
        vnp_txn_ref=vnp_txn_ref
    )
    db.add(purchase)
    db.commit()
    db.refresh(purchase)
    return purchase

def update_purchase_status(db: Session, vnp_txn_ref: str, status: str, vnp_transaction_no: str):
    purchase = db.query(Purchase).filter(Purchase.vnp_txn_ref == vnp_txn_ref).first()
    if purchase:
        purchase.status = status
        purchase.vnp_transaction_no = vnp_transaction_no
        db.commit()
        db.refresh(purchase)
    return purchase
