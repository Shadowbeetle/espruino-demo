python -m esptool --port COM5 --baud 115200 write_flash --verify --flash_freq 80m --flash_mode dio --flash_size 32m 0x0000 "boot_v1.6.bin" 0x1000 espruino_esp8266_user1.bin 0x3FC000 esp_init_data_default.bin 0x37E000 blank.bin