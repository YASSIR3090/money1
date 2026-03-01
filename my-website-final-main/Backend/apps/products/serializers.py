# backend/apps/products/serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    """
    Product Serializer - PUBLIC ACCESS KAMILI
    """
    
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['id', 'registration_date', 'last_updated']
    
    def validate(self, data):
        """Accept all data - no validation"""
        print(f"📥 Serializer accepting data: {data}")
        return data
    
    def create(self, validated_data):
        """Create product in database"""
        print(f"📝 Serializer creating product with: {validated_data}")
        
        try:
            product = Product.objects.create(**validated_data)
            print(f"✅ Serializer saved product ID: {product.id}")
            return product
        except Exception as e:
            print(f"❌ Serializer error: {e}")
            return Product.objects.create(
                product_name=validated_data.get('product_name', 'Product'),
                price=validated_data.get('price', 0),
                business_type=validated_data.get('business_type', ''),
                profile_picture=validated_data.get('profile_picture', ''),
                product_images=validated_data.get('product_images', []),
                country=validated_data.get('country', 'Tanzania')
            )
    
    def to_representation(self, instance):
        """Return product data"""
        data = super().to_representation(instance)
        
        if data.get('price'):
            try:
                price_val = float(data['price'])
                data['price_formatted'] = f"{int(price_val):,} TZS"
            except:
                data['price_formatted'] = "0 TZS"
        else:
            data['price_formatted'] = "0 TZS"
        
        return data